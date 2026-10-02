import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section";

// ==========================================
// GET ALL SECTIONS
// ==========================================

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
          message: "Only instructors can access sections.",
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

    const sections = await Section.find({
      course: course._id,
    }).sort({
      order: 1,
    });

    return Response.json({
      success: true,
      message: "Sections fetched successfully.",
      sections,
    });
  } catch (error) {
    console.error("Get Sections Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

// ==========================================
// CREATE SECTION
// ==========================================

export async function POST(request, { params }) {
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
          message: "Only instructors can create sections.",
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

    const { title, description = "" } = body;

    if (!title?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Section title is required.",
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

    // Find last section
    const lastSection = await Section.findOne({
      course: course._id,
    }).sort({
      order: -1,
    });

    const sectionOrder = lastSection ? lastSection.order + 1 : 0;

    const section = await Section.create({
      course: course._id,
      title: title.trim(),
      description: description.trim(),
      order: sectionOrder,
      isPublished: false,
    });

    return Response.json(
      {
        success: true,
        message: "Section created successfully.",
        section,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Section Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
