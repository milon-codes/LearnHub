import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    // 1. Check authentication
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

    // 2. Check instructor role
    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can access the dashboard.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const instructorId = session.user.id;

    // 3. Get instructor courses
    const courses = await Course.find({
      instructor: instructorId,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    // 4. Basic course statistics
    const totalCourses = courses.length;

    const publishedCourses = courses.filter(
      (course) => course.status === "published",
    ).length;

    const draftCourses = courses.filter(
      (course) => course.status === "draft",
    ).length;

    const pendingCourses = courses.filter(
      (course) => course.status === "pending",
    ).length;

    const rejectedCourses = courses.filter(
      (course) => course.status === "rejected",
    ).length;

    // 5. Total students
    const totalStudents = courses.reduce(
      (total, course) => total + (course.totalStudents || 0),
      0,
    );

    // 6. Total reviews
    const totalReviews = courses.reduce(
      (total, course) => total + (course.totalReviews || 0),
      0,
    );

    // 7. Average rating
    const coursesWithRating = courses.filter(
      (course) => course.totalReviews > 0,
    );

    const averageRating =
      coursesWithRating.length > 0
        ? coursesWithRating.reduce(
            (total, course) => total + (course.rating || 0),
            0,
          ) / coursesWithRating.length
        : 0;

    // 8. Course revenue
    // Current course model does not store actual revenue.
    // So we calculate potential revenue from current price
    // based on total students.
    const totalRevenue = courses.reduce((total, course) => {
      const price =
        course.discountPrice > 0 ? course.discountPrice : course.price;

      return total + price * (course.totalStudents || 0);
    }, 0);

    // 9. Recent courses
    const recentCourses = courses.slice(0, 5);

    // 10. Dashboard response
    return Response.json(
      {
        success: true,
        message: "Instructor dashboard fetched successfully.",

        stats: {
          totalCourses,
          publishedCourses,
          draftCourses,
          pendingCourses,
          rejectedCourses,
          totalStudents,
          totalReviews,
          averageRating: Number(averageRating.toFixed(2)),
          totalRevenue,
        },

        recentCourses,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Instructor Dashboard Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
