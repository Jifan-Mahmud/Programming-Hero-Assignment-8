import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const borrowsCollection = db.collection("borrows");
    const borrowedBooks = await borrowsCollection
      .find({ userId: session.user.id })
      .toArray();

    return NextResponse.json(borrowedBooks);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrowed books" },
      { status: 500 }
    );
  }
}
