import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";

export async function GET(request) {
  try {
    // ========================================
    // 1. Database Connection
    // ========================================

    await connectDB();

    // ========================================
    // 2. Get Query Parameters
    // ========================================

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const category = searchParams.get("category")?.trim() || "";

    const level = searchParams.get("level")?.trim() || "";

    const price = searchParams.get("price")?.trim() || "";

    const minPriceParam = searchParams.get("minPrice");

    const maxPriceParam = searchParams.get("maxPrice");

    const pageParam = searchParams.get("page");

    const limitParam = searchParams.get("limit");

    const sort = searchParams.get("sort")?.trim() || "newest";

    // ========================================
    // 3. Pagination
    // ========================================

    const page = Math.max(Number(pageParam) || 1, 1);

    const limit = Math.min(Math.max(Number(limitParam) || 12, 1), 50);

    const skip = (page - 1) * limit;

    // ========================================
    // 4. Base Filter
    // ========================================

    const filter = {
      status: "published",
    };

    // ========================================
    // 5. Search
    // ========================================

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
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ========================================
    // 6. Category Filter
    // ========================================

    if (category) {
      const categoryData = await Category.findOne({
        slug: category.toLowerCase(),
        isActive: true,
      }).select("_id");

      if (!categoryData) {
        return Response.json({
          success: true,
          message: "Courses fetched successfully.",
          courses: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCourses: 0,
            limit,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          },
          filters: {
            search,
            category,
            level,
            price,
            minPrice: minPriceParam !== null ? minPrice : null,
            maxPrice: maxPriceParam !== null ? maxPrice : null,
            sort,
          },
        });
      }

      filter.category = categoryData._id;
    }

    // ========================================
    // 7. Level Filter
    // ========================================

    if (level) {
      const allowedLevels = ["beginner", "intermediate", "advanced"];

      if (!allowedLevels.includes(level)) {
        return Response.json(
          {
            success: false,
            message: "Invalid level. Use beginner, intermediate, or advanced.",
          },
          { status: 400 },
        );
      }

      filter.level = level;
    }

    // ========================================
    // 8. Price Filter
    // ========================================
    if (price === "free") {
      filter.$and = [...(filter.$and || []), { price: 0 }];
    }

    if (price === "paid") {
      filter.$and = [...(filter.$and || []), { price: { $gt: 0 } }];
    }
    // ========================================
    // 9. Min / Max Price
    // ========================================

    const minPrice = Number(minPriceParam);
    const maxPrice = Number(maxPriceParam);

    if (minPriceParam !== null && Number.isFinite(minPrice) && minPrice >= 0) {
      filter.price = {
        ...(filter.price || {}),
        $gte: minPrice,
      };
    }

    if (maxPriceParam !== null && Number.isFinite(maxPrice) && maxPrice >= 0) {
      filter.price = {
        ...(filter.price || {}),
        $lte: maxPrice,
      };
    }

    // ========================================
    // 10. Sorting
    // ========================================

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "price-low":
        sortOption = {
          price: 1,
        };
        break;

      case "price-high":
        sortOption = {
          price: -1,
        };
        break;

      case "rating":
        sortOption = {
          rating: -1,
          totalReviews: -1,
        };
        break;

      case "students":
        sortOption = {
          totalStudents: -1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    // ========================================
    // 11. Fetch Courses
    // ========================================

    const [courses, totalCourses] = await Promise.all([
      Course.find(filter)
        .populate("category", "name slug")
        .populate("instructor", "name avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),

      Course.countDocuments(filter),
    ]);

    // ========================================
    // 12. Pagination Information
    // ========================================

    const totalPages = Math.ceil(totalCourses / limit);

    // ========================================
    // 13. Response
    // ========================================

    return Response.json({
      success: true,
      message: "Courses fetched successfully.",

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
        category,
        level,
        price,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        sort,
      },
    });
  } catch (error) {
    console.error("Get Published Courses Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching courses.",
      },
      { status: 500 },
    );
  }
}
