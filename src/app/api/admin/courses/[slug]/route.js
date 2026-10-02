import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET(request, { params }) {
  try {
    // ========================================
    // 1. Authentication
    // ========================================

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

    // ========================================
    // 2. Admin Authorization
    // ========================================

    if (session.user?.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Only admins can access course details.",
        },
        { status: 403 },
      );
    }

    // ========================================
    // 3. Params
    // ========================================

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

    // ========================================
    // 4. Database
    // ========================================

    await connectDB();

    // ========================================
    // 5. Find Course
    // ========================================

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
    })
      .populate("instructor", "name email image")
      .populate("category", "name slug")
      .lean();

    // ========================================
    // 6. Course Not Found
    // ========================================

    if (!course) {
      return Response.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 },
      );
    }

    // ========================================
    // 7. Response
    // ========================================

    return Response.json({
      success: true,
      message: "Course details fetched successfully.",
      course,
    });
  } catch (error) {
    console.error("Admin Course Details Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    // ========================================
    // 1. Authentication
    // ========================================

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

    // ========================================
    // 2. Admin Authorization
    // ========================================

    if (session.user?.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Only admins can manage courses.",
        },
        { status: 403 },
      );
    }

    // ========================================
    // 3. Params
    // ========================================

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

    // ========================================
    // 4. Request Body
    // ========================================

    const body = await request.json();

    const { action } = body;

    // ========================================
    // 5. Validate Action
    // ========================================

    const allowedActions = ["unpublish"];

    if (!allowedActions.includes(action)) {
      return Response.json(
        {
          success: false,
          message: "Invalid course action.",
        },
        { status: 400 },
      );
    }

    // ========================================
    // 6. Database
    // ========================================

    await connectDB();

    // ========================================
    // 7. Find Course
    // ========================================

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
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

    // ========================================
    // 8. Unpublish
    // ========================================

    if (action === "unpublish") {
      if (course.status !== "published") {
        return Response.json(
          {
            success: false,
            message: "Only published courses can be unpublished.",
          },
          { status: 400 },
        );
      }

      course.status = "draft";

      await course.save();

      return Response.json({
        success: true,
        message: "Course unpublished successfully.",
        course,
      });
    }

    // ========================================
    // 9. Fallback
    // ========================================

    return Response.json(
      {
        success: false,
        message: "Invalid action.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Admin Course Action Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

// ========================================
// DELETE COURSE
// ========================================

export async function DELETE(request, { params }) {
  try {
    // ========================================
    // 1. Authentication
    // ========================================

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

    // ========================================
    // 2. Admin Authorization
    // ========================================

    if (session.user?.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Only admins can delete courses.",
        },
        { status: 403 },
      );
    }

    // ========================================
    // 3. Params
    // ========================================

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

    // ========================================
    // 4. Database
    // ========================================

    await connectDB();

    // ========================================
    // 5. Find Course
    // ========================================

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
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

    // ========================================
    // 6. Delete Course
    // ========================================

    await Course.deleteOne({
      _id: course._id,
    });

    // ========================================
    // 7. Response
    // ========================================

    return Response.json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Admin Course Delete Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
