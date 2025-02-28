import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/service/Plaid";

const START_DATE = "2024-01-01"; // Adjust as needed
const END_DATE = new Date().toISOString().split("T")[0];

export async function GET() {
  try {
    // Get current user details
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const access_token = user.publicMetadata.access_token as string;
    if (!access_token) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 400 },
      );
    }

    // Fetch transactions from Plaid
    const response = await client.transactionsGet({
      access_token,
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
