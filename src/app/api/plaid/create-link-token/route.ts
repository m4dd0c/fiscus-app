import { NextRequest, NextResponse } from "next/server";
import { Products, CountryCode } from "plaid";
import { client } from "@/lib/service/Plaid";

export async function POST(req: NextRequest) {
 try {
  const { client_user_id } = await req.json();
  const response = await client.linkTokenCreate({
   user: { client_user_id },
   client_name: "FISCUS",
   products: [Products.Auth, Products.Transactions],
   country_codes: [CountryCode.Us],
   language: "en",
  });
  return NextResponse.json({ link_token: response.data.link_token });
 } catch (error) {
  return NextResponse.json(
   { error: "Error generating link token" },
   { status: 500 }
  );
 }
}
