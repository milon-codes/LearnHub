import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return Response.json(
        { success: false, message: "You must be logged in." },
        { status: 401 },
      );
    }

    if (session.user?.role !== "instructor") {
      return Response.json(
        { success: false, message: "Only instructors can access categories." },
        { status: 403 },
      );
    }

    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      message: "Categories fetched successfully.",
      categories,
    });
  } catch (error) {
    console.error("Instructor Categories Error:", error);

    return Response.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}