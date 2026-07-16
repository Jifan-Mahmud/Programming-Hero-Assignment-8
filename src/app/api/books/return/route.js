import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const borrowsCollection = db.collection("borrows");

    const borrowRecord = await borrowsCollection.findOne({
      userId: session.user.id,
      bookId: bookId,
    });

    if (!borrowRecord) {
      return NextResponse.json({ error: "Borrow record not found" }, { status: 404 });
    }

    // Delete borrow record
    await borrowsCollection.deleteOne({ _id: borrowRecord._id });

    // Increment available quantity
    const booksCollection = db.collection("books");
    await booksCollection.updateOne(
      { id: bookId },
      { $inc: { available_quantity: 1 } }
    );

    return NextResponse.json({ message: "Successfully returned book" });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json({ error: "Failed to return book" }, { status: 500 });
  }
}
