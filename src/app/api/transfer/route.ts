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
    if (!sourceFundingSourceUrl || !destinationFundingSourceUrl) {
      return NextResponse.json(
        {
          error:
            "Either Reciever or the Sender is not a customer in dwolla platform.",
        },
        { status: 404 },
      );
    }

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
    const location = data.headers.get("location");
    if (!location)
      return NextResponse.json(
        { error: "Error transferring funds." },
        { status: 500 },
      );
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
    return NextResponse.json({ location }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error transferring funds." },
      { status: 500 },
    );
  }
}
