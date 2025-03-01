import { NextResponse } from "next/server";
import { client } from "@/lib/service/Plaid";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
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
    // getting detailed accounts
    const response = await client.authGet({ access_token });
    const { accounts, numbers, request_id } = response.data;

    return NextResponse.json({ accounts, numbers, request_id });
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating link token", stack: error },
      { status: 500 },
    );
  }
}
