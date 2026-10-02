import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";

export async function GET(request, { params }) {
  try {
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

    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can access course details.",
        },
        { status: 403 },
      );
    }

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

    await connectDB();

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
      instructor: session.user.id,
    })
      .populate("category", "name slug description icon image")
      .populate("instructor", "name email avatar bio")
      .lean();

    if (!course) {
      return Response.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Course details fetched successfully.",
        course,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Course Details Error:", error);

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

    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can update courses.",
        },
        { status: 403 },
      );
    }

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

    const body = await request.json();

    const {
      title,
      newSlug,
      description,
      shortDescription,
      thumbnail,
      category,
      price,
      discountPrice,
      level,
      language,
      duration,
      requirements,
      whatYouWillLearn,
      tags,
      isFeatured,
    } = body;

    await connectDB();

    // Find only this instructor's course
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

    // Check new slug
    if (newSlug && newSlug.toLowerCase().trim() !== course.slug) {
      const existingCourse = await Course.findOne({
        slug: newSlug.toLowerCase().trim(),
        _id: { $ne: course._id },
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

      course.slug = newSlug.toLowerCase().trim();
    }

    // Category validation
    if (category) {
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

      course.category = category;
    }

    // Price validation
    if (price !== undefined && Number(price) < 0) {
      return Response.json(
        {
          success: false,
          message: "Price cannot be negative.",
        },
        { status: 400 },
      );
    }

    if (discountPrice !== undefined && Number(discountPrice) < 0) {
      return Response.json(
        {
          success: false,
          message: "Discount price cannot be negative.",
        },
        { status: 400 },
      );
    }

    const finalPrice = price !== undefined ? Number(price) : course.price;

    const finalDiscountPrice =
      discountPrice !== undefined
        ? Number(discountPrice)
        : course.discountPrice;

    if (finalDiscountPrice > finalPrice) {
      return Response.json(
        {
          success: false,
          message: "Discount price cannot be greater than the original price.",
        },
        { status: 400 },
      );
    }

    // Update fields
    if (title !== undefined) course.title = title.trim();

    if (description !== undefined) {
      course.description = description.trim();
    }

    if (shortDescription !== undefined) {
      course.shortDescription = shortDescription.trim();
    }

    if (thumbnail !== undefined) {
      course.thumbnail = thumbnail.trim();
    }

    if (price !== undefined) {
      course.price = Number(price);
    }

    if (discountPrice !== undefined) {
      course.discountPrice = Number(discountPrice);
    }

    if (level !== undefined) {
      course.level = level;
    }

    if (language !== undefined) {
      course.language = language.trim();
    }

    if (duration !== undefined) {
      course.duration = Number(duration);
    }

    if (requirements !== undefined) {
      course.requirements = requirements;
    }

    if (whatYouWillLearn !== undefined) {
      course.whatYouWillLearn = whatYouWillLearn;
    }

    if (tags !== undefined) {
      course.tags = tags;
    }

    if (isFeatured !== undefined) {
      course.isFeatured = Boolean(isFeatured);
    }

    await course.save();

    const updatedCourse = await Course.findById(course._id)
      .populate("category", "name slug description icon image")
      .populate("instructor", "name email avatar bio")
      .lean();

    return Response.json(
      {
        success: true,
        message: "Course updated successfully.",
        course: updatedCourse,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Course Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
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

    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can delete courses.",
        },
        { status: 403 },
      );
    }

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

    await connectDB();

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

    await Course.findByIdAndDelete(course._id);

    return Response.json(
      {
        success: true,
        message: "Course deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Course Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
