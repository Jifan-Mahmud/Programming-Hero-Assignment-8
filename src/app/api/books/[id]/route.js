import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const booksCollection = db.collection("books");

    const book = await booksCollection.findOne({ id });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book details:", error);
    return NextResponse.json(
      { error: "Failed to fetch book details" },
      { status: 500 }
    );
  }
}
