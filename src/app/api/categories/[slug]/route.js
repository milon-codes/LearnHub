import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    await connectDB();

    const category = await Category.findOne({
      slug: slug.toLowerCase(),
    }).lean();

    if (!category) {
      return Response.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Category fetched successfully.",
        category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Single Category Error:", error);

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
        { success: false, message: "You must be logged in." },
        { status: 401 },
      );
    }

    if (session.user?.role !== "admin") {
      return Response.json(
        { success: false, message: "Only admins can manage categories." },
        { status: 403 },
      );
    }
    const { slug } = await params;
    const body = await request.json();

    const { name, newSlug, description, icon, image, isActive, order } = body;

    await connectDB();

    // Find existing category
    const category = await Category.findOne({
      slug: slug.toLowerCase(),
    });

    if (!category) {
      return Response.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 },
      );
    }

    // Check duplicate name
    if (name && name.trim() !== category.name) {
      const existingName = await Category.findOne({
        name: name.trim(),
        _id: { $ne: category._id },
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

      category.name = name.trim();
    }

    // Check duplicate slug
    if (newSlug && newSlug.toLowerCase().trim() !== category.slug) {
      const existingSlug = await Category.findOne({
        slug: newSlug.toLowerCase().trim(),
        _id: { $ne: category._id },
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

      category.slug = newSlug.toLowerCase().trim();
    }

    // Update optional fields
    if (description !== undefined) {
      category.description = description.trim();
    }

    if (icon !== undefined) {
      category.icon = icon.trim();
    }

    if (image !== undefined) {
      category.image = image.trim();
    }

    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }

    if (order !== undefined) {
      category.order = Number(order) || 0;
    }

    await category.save();

    return Response.json(
      {
        success: true,
        message: "Category updated successfully.",
        category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Category Error:", error);

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
        { success: false, message: "You must be logged in." },
        { status: 401 },
      );
    }

    if (session.user?.role !== "admin") {
      return Response.json(
        { success: false, message: "Only admins can manage categories." },
        { status: 403 },
      );
    }
    
    const { slug } = await params;

    await connectDB();

    // Find category
    const category = await Category.findOne({
      slug: slug.toLowerCase(),
    });

    if (!category) {
      return Response.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 },
      );
    }

    // Delete category
    await Category.findByIdAndDelete(category._id);

    return Response.json(
      {
        success: true,
        message: "Category deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Category Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
