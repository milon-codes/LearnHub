import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";

export async function POST(request) {
  try {
    // Check login
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

    // Check instructor role
    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can create courses.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const {
      title,
      slug,
      description,
      shortDescription = "",
      thumbnail = "",
      category,
      price = 0,
      discountPrice = 0,
      level = "beginner",
      language = "English",
      duration = 0,
      requirements = [],
      whatYouWillLearn = [],
      tags = [],
      isFeatured = false,
    } = body;

    // Required fields
    if (!title || !slug || !description || !category) {
      return Response.json(
        {
          success: false,
          message: "Title, slug, description and category are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Check duplicate slug
    const existingCourse = await Course.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (existingCourse) {
      return Response.json(
        {
          success: false,
          message: "Course slug already exists.",
        },
        { status: 409 },
      );
    }

    // Check category exists
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return Response.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 },
      );
    }

    // Validate prices
    if (Number(price) < 0 || Number(discountPrice) < 0) {
      return Response.json(
        {
          success: false,
          message: "Price cannot be negative.",
        },
        { status: 400 },
      );
    }

    if (Number(discountPrice) > Number(price)) {
      return Response.json(
        {
          success: false,
          message: "Discount price cannot be greater than the original price.",
        },
        { status: 400 },
      );
    }

    // Create course
    const course = await Course.create({
      title: title.trim(),
      slug: slug.toLowerCase().trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      thumbnail: thumbnail.trim(),

      // Instructor comes from session
      instructor: session.user.id,

      category,

      price: Number(price),
      discountPrice: Number(discountPrice),

      level,
      language: language.trim(),
      duration: Number(duration),

      requirements,
      whatYouWillLearn,
      tags,

      // New courses always start as draft
      status: "draft",

      isFeatured: Boolean(isFeatured),
    });

    return Response.json(
      {
        success: true,
        message: "Course created successfully.",
        course,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Course Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Check login
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

    // Check instructor role
    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can access this course list.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const courses = await Course.find({
      instructor: session.user.id,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(
      {
        success: true,
        message: "Courses fetched successfully.",
        courses,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Instructor Courses Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
