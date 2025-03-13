import { dwollaClient } from "@/lib/service/Dwolla";
import { prismaClient } from "@/lib/service/Prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sourceAccountId, destinationAccountId, amount } = await req.json();

    if (!sourceAccountId || !destinationAccountId || !amount) {
      return NextResponse.json({ error: "Invalid request" }, { status: 422 });
    }
    // get funding source url from the user
    const sourceUser = await prismaClient.user.findFirst({
      where: { accountId: sourceAccountId },
    });
    const destinationUser = await prismaClient.user.findFirst({
      where: { accountId: destinationAccountId },
    });

    console.log(
      "sourceUser",
      !!sourceUser,
      "destinationUser",
      !!destinationUser,
    );
    if (!sourceUser || !destinationUser) {
      return NextResponse.json(
        {
          error:
            "Account not found. Please make sure the account exists in the system.",
        },
        { status: 404 },
      );
    }

    const sourceFundingSourceUrl = sourceUser.fundingSourceUrl;
    const destinationFundingSourceUrl = destinationUser.fundingSourceUrl;
    console.log(
      "sourceFundingSourceUrl",
      sourceFundingSourceUrl,
      "destinationFundingSourceUrl",
      destinationFundingSourceUrl,
    );
    if (!sourceFundingSourceUrl || !destinationFundingSourceUrl) {
      return NextResponse.json(
        {
          error:
            "Either Reciever or the Sender is not a customer in dwolla platform.",
        },
        { status: 404 },
      );
    }

    console.log("3rd sending requbody");
    const requestBody = {
      _links: {
        source: { href: sourceFundingSourceUrl },
        destination: { href: destinationFundingSourceUrl },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    const data = await dwollaClient.post("transfers", requestBody);
    console.log("4rd dwolla reply", data.body, data.headers, data.status);
    const location = data.headers.get("location");
    if (!location)
      return NextResponse.json(
        { error: "Error transferring funds." },
        { status: 500 },
      );
    console.log("5rd creating receipt");
    // creating receipt
    await prismaClient.receipt.create({
      data: {
        amount,
        sourceAccountId,
        sourceUserId: sourceUser.id,
        destinationAccountId,
        destinationUserId: destinationUser.id,
        transferId: location,
      },
    });
    console.log("6rd last receipt");
    return NextResponse.json({ location }, { status: 200 });
  } catch (error) {
    console.log("0 last receipt", error?.stack);
    return NextResponse.json(
      { error: "Error transferring funds.", stack: error },
      { status: 500 },
    );
  }
}
