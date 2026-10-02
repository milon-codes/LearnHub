import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function POST(request, { params }) {
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
          message: "Only admins can review courses.",
        },
        { status: 403 },
      );
    }

    // ========================================
    // 3. Get Course Slug
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

    const { action, rejectionReason = "" } = body;

    // ========================================
    // 5. Validate Action
    // ========================================

    if (!["approve", "reject"].includes(action)) {
      return Response.json(
        {
          success: false,
          message: "Invalid action. Use approve or reject.",
        },
        { status: 400 },
      );
    }

    // ========================================
    // 6. Validate Rejection Reason
    // ========================================

    if (action === "reject" && !rejectionReason?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Rejection reason is required.",
        },
        { status: 400 },
      );
    }

    // ========================================
    // 7. Database
    // ========================================

    await connectDB();

    // ========================================
    // 8. Find Course
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
    // 9. Only Pending Courses
    // ========================================

    if (course.status !== "pending") {
      return Response.json(
        {
          success: false,
          message: "Only pending courses can be reviewed.",
        },
        { status: 400 },
      );
    }

    // ========================================
    // 10. APPROVE COURSE
    // ========================================

    if (action === "approve") {
      course.status = "published";

      // Clear previous rejection reason
      course.rejectionReason = "";

      await course.save();

      return Response.json({
        success: true,
        message: "Course approved and published successfully.",
        course,
      });
    }

    // ========================================
    // 11. REJECT COURSE
    // ========================================

    if (action === "reject") {
      course.status = "rejected";

      course.rejectionReason = rejectionReason.trim();

      await course.save();

      return Response.json({
        success: true,
        message: "Course rejected successfully.",
        course,
      });
    }

    // ========================================
    // 12. Fallback
    // ========================================

    return Response.json(
      {
        success: false,
        message: "Invalid review action.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Admin Course Review Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
