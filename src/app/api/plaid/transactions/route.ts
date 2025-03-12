import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/lib/service/Plaid";
import { prismaClient } from "@/lib/service/Prisma";

const START_DATE = "2024-01-01";
const END_DATE = new Date().toISOString().split("T")[0];

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "user not found" }, { status: 401 });
    // get current user details
    const user = await prismaClient.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    if (!user.accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 400 },
      );
    }

    // fetch transactions from plaid
    const response = await client.transactionsGet({
      access_token: user.accessToken,
      start_date: START_DATE,
      end_date: END_DATE,
    });

    return NextResponse.json({ transactions: response.data.transactions });
  } catch (error) {
    console.log("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
