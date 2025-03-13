import { dwollaClient } from "@/lib/service/Dwolla";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sourceFundingSourceUrl, destinationFundingSourceUrl, amount } =
      await req.json();

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
    return NextResponse.json({ location }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error transferring funds.", stack: error },
      { status: 500 },
    );
  }
}
