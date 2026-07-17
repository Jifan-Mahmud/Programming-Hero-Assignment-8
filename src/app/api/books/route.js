import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import booksData from "@/data/books.json";

export async function GET() {
  try {
    const db = await getDb();
    const booksCollection = db.collection("books");

    const count = await booksCollection.countDocuments();
    if (count === 0) {
      // Seed books into MongoDB
      await booksCollection.insertMany(booksData);
    } else {
      // Sync image URLs from JSON in case any broken links were updated
      for (const book of booksData) {
        await booksCollection.updateOne(
          { id: book.id },
          { $set: { image_url: book.image_url } }
        );
      }
    }

    const books = await booksCollection.find({}).toArray();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to load books" },
      { status: 500 }
    );
  }
}
