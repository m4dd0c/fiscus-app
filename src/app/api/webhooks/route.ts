import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prismaClient } from "@/lib/service/Prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error(
        "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env",
      );
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Missing Svix headers" },
        {
          status: 400,
        },
      );
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    // Verify payload with headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error: Could not verify webhook:", err);
      return NextResponse.json(
        { error: "Message verification error." },
        {
          status: 400,
        },
      );
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    console.log("Webhook payload:", body);

    if (evt.type === "user.created") {
      console.log("created userId:", evt.data.id);
      const { id, username, email_addresses } = evt.data;
      if (!id || !username)
        return NextResponse.json(
          { error: "Invalid clerkId or username." },
          { status: 400 },
        );
      const user = await prismaClient.user.create({
        data: {
          clerkId: id,
          username,
          email: email_addresses[0].email_address,
        },
      });
      console.log(user, "is created user");
      return NextResponse.json(
        { message: "User created in DB" },
        { status: 201 },
      );
    }

    if (evt.type === "user.updated") {
      console.log("updated user:", evt.data);
      const { id, username, email_addresses } = evt.data;
      if (!id || !username)
        return NextResponse.json(
          { error: "Invalid clerkId or username." },
          { status: 400 },
        );
      const user = await prismaClient.user.update({
        where: { clerkId: evt.data.id },
        data: {
          clerkId: id,
          username,
          email: email_addresses[0].email_address,
        },
      });
      console.log(user, "is updated user");
      return NextResponse.json(
        { message: "User updated in DB" },
        { status: 200 },
      );
    }
    if (evt.type === "user.deleted") {
      console.log("deleted userId:", evt.data.id);
      const user = await prismaClient.user.delete({
        where: {
          clerkId: evt.data.id,
        },
      });
      console.log(user, "is deleted user");
      return NextResponse.json(
        { message: "User deleted from DB" },
        { status: 200 },
      );
    }
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Some error occured.",
      },
      { status: 400 },
    );
  }
}
