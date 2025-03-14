import { prismaClient } from "@/lib/service/Prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 401 },
      );

    const user = await prismaClient.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) return NextResponse.json({}, {});
    const data = await prismaClient.receipt.findMany({
      where: {
        OR: [{ sourceUserId: user.id }, { destinationUserId: user.id }],
      },
      include: {
        sourceUser: { select: { username: true } },
        destinationUser: { select: { username: true } },
      },
    });

    return NextResponse.json({ invoices: data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
