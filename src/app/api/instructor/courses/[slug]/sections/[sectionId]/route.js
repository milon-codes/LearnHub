import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section";

// UPDATE SECTION
export async function PUT(request, { params }) {
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
          message: "Only instructors can update sections.",
        },
        { status: 403 },
      );
    }

    // ----------------------------------------
    // 3. Params
    // ----------------------------------------

    const { slug, sectionId } = await params;

    if (!slug || !sectionId) {
      return Response.json(
        {
          success: false,
          message: "Course slug and section ID are required.",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------
    // 4. Request Body
    // ----------------------------------------

    const body = await request.json();

    const { title, description = "", order, isPublished } = body;

    // ----------------------------------------
    // 5. Validation
    // ----------------------------------------

    if (!title?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Section title is required.",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------
    // 6. Database
    // ----------------------------------------

    await connectDB();

    // ----------------------------------------
    // 7. Find Instructor's Course
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
    // 8. Find Section
    // ----------------------------------------

    const section = await Section.findOne({
      _id: sectionId,
      course: course._id,
    });

    if (!section) {
      return Response.json(
        {
          success: false,
          message: "Section not found.",
        },
        { status: 404 },
      );
    }

    // ----------------------------------------
    // 9. Update Section
    // ----------------------------------------

    section.title = title.trim();
    section.description = description?.trim() || "";

    if (order !== undefined) {
      const parsedOrder = Number(order);

      if (Number.isFinite(parsedOrder) && parsedOrder >= 0) {
        section.order = parsedOrder;
      }
    }

    if (typeof isPublished === "boolean") {
      section.isPublished = isPublished;
    }

    await section.save();

    // ----------------------------------------
    // 10. Response
    // ----------------------------------------

    return Response.json({
      success: true,
      message: "Section updated successfully.",
      section,
    });
  } catch (error) {
    console.error("Update Section Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

// DELETE SECTION

export async function DELETE(request, { params }) {
  try {
    // -----------------------------
    // 1. Authentication
    // -----------------------------

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

    // -----------------------------
    // 2. Instructor Check
    // -----------------------------

    if (session.user?.role !== "instructor") {
      return Response.json(
        {
          success: false,
          message: "Only instructors can delete sections.",
        },
        { status: 403 },
      );
    }

    // -----------------------------
    // 3. Get Params
    // -----------------------------

    const { slug, sectionId } = await params;

    if (!slug || !sectionId) {
      return Response.json(
        {
          success: false,
          message: "Course slug and section ID are required.",
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // 4. Database Connection
    // -----------------------------

    await connectDB();

    // -----------------------------
    // 5. Find Instructor's Course
    // -----------------------------

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

    // -----------------------------
    // 6. Find Section
    // -----------------------------

    const section = await Section.findOne({
      _id: sectionId,
      course: course._id,
    });

    if (!section) {
      return Response.json(
        {
          success: false,
          message: "Section not found.",
        },
        { status: 404 },
      );
    }

    // -----------------------------
    // 7. Delete Section
    // -----------------------------

    await Section.deleteOne({
      _id: section._id,
    });

    // -----------------------------
    // 8. Success Response
    // -----------------------------

    return Response.json({
      success: true,
      message: "Section deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Section Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
