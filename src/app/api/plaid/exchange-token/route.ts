import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/service/Plaid";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { prismaClient } from "@/lib/service/Prisma";
import { dwollaClient } from "@/lib/service/Dwolla";
import { ProcessorTokenCreateRequestProcessorEnum } from "plaid";
import { uuidFromUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { public_token } = await req.json();
    // getting clerk user id
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prismaClient.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user)
      return NextResponse.json({ error: "user not found" }, { status: 401 });

    console.log("user is found 1");
    if (user?.accessToken && user?.fundingSourceUrl && user?.dwollaCustomerId) {
      console.log("user has everything already 2");
      return NextResponse.json(
        { message: "Bank already connected." },
        { status: 200 },
      );
    }
    console.log("user doesnot have anything already 3");

    // 1A: Creating dwolla customer
    const dwollaCustomer = await dwollaClient.post("customers", {
      firstName: clerkUser?.firstName || clerkUser?.username,
      lastName: clerkUser?.lastName || "",
      email: clerkUser?.emailAddresses[0].emailAddress,
    });
    const location = dwollaCustomer.headers.get("location");
    const dwollaCustomerId = location ? uuidFromUrl(location) : undefined;
    console.log("dwolla customer created 4", location);

    // 2A: Would be creating the public token (ref: /api/create-link-token)
    // 2B: Exchange public_token for access_token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    const access_token = response.data.access_token;

    console.log("plaid access_token created 5", access_token);
    // 2C: Get account data using the access_token (to be more specific getting account_id)
    const accountsResponse = await plaidClient.accountsGet({
      access_token: access_token,
    });
    const accountData = accountsResponse.data.accounts[0];
    console.log("plaid account id retrieved 6", accountData.account_id);

    // 2D: Create a Plaid processor token
    const request = {
      access_token,
      account_id: accountData.account_id,
      processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    console.log("plaid processor token created 7", processorToken);
    // NOTE: May need to add exchangehref and createExchange

    // 2E: Create a Dwolla funding source using the processor token
    const fundingSourceUrl = await createFundingSource({
      customerId: dwollaCustomerId,
      fundingSourceName: accountData.name,
      plaidToken: processorToken,
    });

    if (!fundingSourceUrl)
      return NextResponse.json(
        { error: "Couldn't create fundingSourceUrl" },
        { status: 400 },
      );
    console.log("dwolla funding source created 8", fundingSourceUrl);

    const clerk = await clerkClient();
    // publicMetadata can only store upto 8kb
    await clerk.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        access_token,
        fundingSourceUrl,
        dwollaCustomerId,
      },
    });
    console.log("saved in metadata clerk 9");
    // Save the bank account details in the database
    const updateUser = await prismaClient.user.update({
      where: {
        clerkId: clerkUser.id,
      },
      data: {
        accessToken: access_token,
        fundingSourceUrl,
        dwollaCustomerId,
      },
    });

    if (!updateUser)
      return NextResponse.json(
        { error: "Couldn't save access_token or fundingSourceUrl" },
        { status: 400 },
      );

    console.log("saved in postgres db 10");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error exchanging token:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 },
    );
  }
}

const createFundingSource = async (options: any) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
};
