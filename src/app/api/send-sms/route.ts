import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const POST = async (req: NextRequest) => {
  try {
    const { budget, exceed } = await req.json();
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access_token = user.publicMetadata.access_token as string;
    if (!access_token) {
      return NextResponse.json(
        { error: "Bank account is not added yet." },
        { status: 400 },
      );
    }
    const body = `${user?.username} your expenses gone beyond your budget, The Budget was ${budget} and your expenses exceeded that amount, which is ${exceed}.`;

    const to = user?.primaryPhoneNumber?.phoneNumber || "+916378259689";
    await client.messages.create({
      from: "+12626003584",
      to,
      body,
    });
    return NextResponse.json(
      { message: "Message send successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error, error?.message, error?.response?.data);
    return NextResponse.json(
      { error: "Error sending message." },
      { status: 400 },
    );
  }
};
