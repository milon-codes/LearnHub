import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET(request) {
  try {
    // ==========================================
    // 1. Authentication
    // ==========================================

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

    // ==========================================
    // 2. Admin Check
    // ==========================================

    if (session.user?.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Only admins can access courses.",
        },
        { status: 403 },
      );
    }

    // ==========================================
    // 3. Query Params
    // ==========================================

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status")?.trim().toLowerCase() || "";
    const search = searchParams.get("search")?.trim() || "";
    const pageParam = searchParams.get("page") || "1";
    const limitParam = searchParams.get("limit") || "10";

    // ==========================================
    // 4. Validate Pagination
    // ==========================================

    let page = Number(pageParam);
    let limit = Number(limitParam);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 10;
    }

    // Prevent very large requests
    if (limit > 50) {
      limit = 50;
    }

    const skip = (page - 1) * limit;

    // ==========================================
    // 5. Validate Status
    // ==========================================

    const allowedStatuses = ["draft", "pending", "published", "rejected"];

    if (status && !allowedStatuses.includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid course status.",
        },
        { status: 400 },
      );
    }

    // ==========================================
    // 6. Database Connection
    // ==========================================

    await connectDB();

    // ==========================================
    // 7. Build Filter
    // ==========================================

    const filter = {};

    // Status filter

    if (status) {
      filter.status = status;
    }

    // Search filter

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // 8. Get Total Courses
    // ==========================================

    const totalCourses = await Course.countDocuments(filter);

    // ==========================================
    // 9. Get Courses
    // ==========================================

    const courses = await Course.find(filter)
      .populate("instructor", "name avatar")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // ==========================================
    // 10. Pagination
    // ==========================================

    const totalPages = Math.ceil(totalCourses / limit);

    // ==========================================
    // 11. Response
    // ==========================================

    return Response.json({
      success: true,
      message: "Admin courses fetched successfully.",
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      filters: {
        search,
        status,
      },
    });
  } catch (error) {
    console.error("Admin Courses GET Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching courses.",
      },
      { status: 500 },
    );
  }
}
