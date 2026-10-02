import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      description = "",
      icon = "",
      image = "",
      order = 0,
    } = body;

    // Required fields
    if (!name || !slug) {
      return Response.json(
        {
          success: false,
          message: "Category name and slug are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Check duplicate name
    const existingName = await Category.findOne({
      name: name.trim(),
    });

    if (existingName) {
      return Response.json(
        {
          success: false,
          message: "Category name already exists.",
        },
        { status: 409 },
      );
    }

    // Check duplicate slug
    const existingSlug = await Category.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (existingSlug) {
      return Response.json(
        {
          success: false,
          message: "Category slug already exists.",
        },
        { status: 409 },
      );
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      description: description.trim(),
      icon: icon.trim(),
      image: image.trim(),
      order: Number(order) || 0,
    });

    return Response.json(
      {
        success: true,
        message: "Category created successfully.",
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Category Error:", error);

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
    await connectDB();

    const categories = await Category.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return Response.json(
      {
        success: true,
        message: "Categories fetched successfully.",
        categories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Categories Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
