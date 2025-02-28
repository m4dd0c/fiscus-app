import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/service/Plaid";
import { currentUser } from "@clerk/nextjs/server";
import {
  createDwollaCustomer,
  addFundingSource,
  transferFunds,
} from "@/lib/service/Dwolla";

export async function POST(req: NextRequest) {
  try {
    const { amount, to, from } = await req.json();

    // get the current user
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // get access_token
    const access_token = user.publicMetadata.access_token as string;
    if (!access_token) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 400 },
      );
    }

    // get accounts details
    const response = await client.authGet({ access_token });
    const { accounts, numbers } = response.data;

    // find sender's account details
    const accountDetails = accounts.find((acc) => acc.account_id === from);
    const achDetails = numbers.ach.find((num) => num.account_id === from);
    if (!accountDetails || !achDetails) {
      return NextResponse.json(
        { error: "Sender account not found" },
        { status: 400 },
      );
    }

    const senderAccount = {
      ...accountDetails,
      routing: achDetails.routing,
      account: achDetails.account,
    };

    const f_name = user?.firstName ? user.firstName : user?.username;
    const l_name = user?.lastName || "unknown";

    // creating dwolla customer
    const customerUrl = await createDwollaCustomer(
      user.emailAddresses[0].emailAddress,
      f_name!,
      l_name,
    );

    // adding funding source location
    const fundingSourceUrl = await addFundingSource(customerUrl, senderAccount);

    // sending funds
    const transferResponse = await transferFunds(fundingSourceUrl, to, amount);

    return NextResponse.json({ success: true, transferResponse });
  } catch (error: any) {
    console.log("Error processing transfer:", error);

    // Log the embedded errors if they exist
    if (error._embedded && error._embedded.errors) {
      console.log("Dwolla Validation Errors:", error._embedded.errors);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
