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
    const booksCollection = db.collection("books");

    // Find the book in DB
    const book = await booksCollection.findOne({ id: bookId });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check available copy count
    if (book.available_quantity <= 0) {
      return NextResponse.json({ error: "No copies left to borrow" }, { status: 400 });
    }

    // Check if already borrowed and not returned
    const borrowsCollection = db.collection("borrows");
    const existingBorrow = await borrowsCollection.findOne({
      userId: session.user.id,
      bookId: bookId,
    });

    if (existingBorrow) {
      return NextResponse.json({ error: "You have already borrowed this book" }, { status: 400 });
    }

    // Decrement available copies
    await booksCollection.updateOne(
      { id: bookId },
      { $inc: { available_quantity: -1 } }
    );

    // Record the borrow
    await borrowsCollection.insertOne({
      userId: session.user.id,
      userEmail: session.user.email,
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      category: book.category,
      image_url: book.image_url,
      borrowedAt: new Date(),
    });

    return NextResponse.json({ message: "Successfully borrowed book" });
  } catch (error) {
    console.error("Error borrowing book:", error);
    return NextResponse.json({ error: "Failed to borrow book" }, { status: 500 });
  }
}
