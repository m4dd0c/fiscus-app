import { NextResponse } from "next/server";
import { client } from "@/lib/service/Plaid";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { public_token } = await req.json();
    // getting clerk user id
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // exchange public_token for access_token
    const response = await client.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;

    const clerk = await clerkClient();

    // store access_token in clerk user metadata, since we don't have db at the moment.
    // publicMetadata can only store upto 8kb
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        access_token,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error exchanging token:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 },
    );
  }
}
