import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function POST(request, { params }) {
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
    // 2. Instructor Check
    // ----------------------------------------

    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can submit courses for review.",
        },
        { status: 403 },
      );
    }

    // ----------------------------------------
    // 3. Get Course Slug
    // ----------------------------------------

    const { slug } = await params;

    if (!slug) {
      return Response.json(
        {
          success: false,
          message: "Course slug is required.",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------
    // 4. Database
    // ----------------------------------------

    await connectDB();

    // ----------------------------------------
    // 5. Find Instructor's Course
    // ----------------------------------------

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
      instructor: session.user.id,
    });

    if (!course) {
      return Response.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 },
      );
    }

    // ----------------------------------------
    // 6. Status Check
    // ----------------------------------------

    if (course.status === "pending") {
      return Response.json(
        {
          success: false,
          message: "This course is already pending for review.",
        },
        { status: 400 },
      );
    }

    if (course.status === "published") {
      return Response.json(
        {
          success: false,
          message: "Published courses cannot be submitted for review.",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------
    // 7. Rejected / Draft → Pending
    // ----------------------------------------

    if (course.status !== "draft" && course.status !== "rejected") {
      return Response.json(
        {
          success: false,
          message: "This course cannot be submitted at this stage.",
        },
        { status: 400 },
      );
    }

    course.status = "pending";

    await course.save();

    // ----------------------------------------
    // 8. Success Response
    // ----------------------------------------

    return Response.json({
      success: true,
      message: "Course submitted for review successfully.",
      course,
    });
  } catch (error) {
    console.error("Submit Course Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
