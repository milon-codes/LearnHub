import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    // ----------------------------------------
    // 1. Authentication
    // ----------------------------------------

    const session = await auth();

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 },
      );
    }

    // ----------------------------------------
    // 2. Admin Check
    // ----------------------------------------

    if (session.user?.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Only admins can view pending courses.",
        },
        { status: 403 },
      );
    }

    // ----------------------------------------
    // 3. Database
    // ----------------------------------------

    await connectDB();

    // ----------------------------------------
    // 4. Get Pending Courses
    // ----------------------------------------

    const courses = await Course.find({
      status: "pending",
    })
      .populate("instructor", "name email image")
      .populate("category", "name slug")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ----------------------------------------
    // 5. Response
    // ----------------------------------------

    return Response.json({
      success: true,
      message: "Pending courses fetched successfully.",
      courses,
    });
  } catch (error) {
    console.error("Get Pending Courses Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
