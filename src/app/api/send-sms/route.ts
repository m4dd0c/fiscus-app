import { twilioClient } from "@/lib/service/Twilio";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
    const body = `Hey ${user?.username}, This is a friendly alert from FISCUS, Your Budget is ${budget} and your exceeded expenses amount is ${exceed}.`;

    const to = user?.primaryPhoneNumber?.phoneNumber || "+916378259689";
    await twilioClient.messages.create({
      from: "+12626003584",
      to,
      body,
    });
    return NextResponse.json(
      { message: "Message send successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error, error?.message, error?.response?.data);
    return NextResponse.json(
      { error: "Error sending message." },
      { status: 400 },
    );
  }
};
