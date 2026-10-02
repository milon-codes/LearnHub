import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section";
import Lesson from "@/models/Lesson";

// ==========================================
// GET SINGLE LESSON
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
          message: "Only instructors can access lessons.",
        },
        { status: 403 },
      );
    }

    const resolvedParams = await params;

    const slug = resolvedParams?.slug;
    const sectionId = resolvedParams?.sectionId;
    const lessonId = resolvedParams?.lessonId;

    console.log("Lesson Params:", slug, sectionId, lessonId);

    if (!slug || !sectionId || !lessonId) {
      return Response.json(
        {
          success: false,
          message: "Course slug, section ID and lesson ID are required.",
          debug: {
            slug,
            sectionId,
            lessonId,
          },
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

    const lesson = await Lesson.findOne({
      _id: lessonId,
      section: section._id,
      course: course._id,
    });

    if (!lesson) {
      return Response.json(
        {
          success: false,
          message: "Lesson not found.",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Get Lesson Error:", error);

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
// UPDATE LESSON
// ==========================================

export async function PUT(request, { params }) {
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
          message: "Only instructors can update lessons.",
        },
        { status: 403 },
      );
    }

    const resolvedParams = await params;
    console.log(resolvedParams, "resolvedParams");

    const slug = resolvedParams?.slug;
    const sectionId = resolvedParams?.sectionId;
    const lessonId = resolvedParams?.lessonsId;

    console.log("Update Lesson Params:", slug, sectionId, lessonId);

    if (!slug || !sectionId || !lessonId) {
      return Response.json(
        {
          success: false,
          message: "Course slug, section ID and lesson ID are required.",
          debug: {
            slug,
            sectionId,
            lessonId,
          },
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const {
      title,
      description = "",
      type = "video",
      videoUrl = "",
      content = "",
      duration = 0,
      order,
      isFree = false,
      isPublished = false,
    } = body;

    if (!title?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Lesson title is required.",
        },
        { status: 400 },
      );
    }

    if (!["video", "article"].includes(type)) {
      return Response.json(
        {
          success: false,
          message: "Invalid lesson type.",
        },
        { status: 400 },
      );
    }

    if (type === "video" && !videoUrl?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Video URL is required for video lessons.",
        },
        { status: 400 },
      );
    }

    if (type === "article" && !content?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Content is required for article lessons.",
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

    const lesson = await Lesson.findOne({
      _id: lessonId,
      section: section._id,
      course: course._id,
    });

    if (!lesson) {
      return Response.json(
        {
          success: false,
          message: "Lesson not found.",
        },
        { status: 404 },
      );
    }

    lesson.title = title.trim();

    lesson.description = description?.trim() || "";

    lesson.type = type;

    lesson.videoUrl = type === "video" ? videoUrl.trim() : "";

    lesson.content = type === "article" ? content.trim() : "";

    lesson.duration = Number(duration) || 0;

    lesson.isFree = Boolean(isFree);

    lesson.isPublished = Boolean(isPublished);

    if (order !== undefined) {
      const parsedOrder = Number(order);

      if (Number.isFinite(parsedOrder) && parsedOrder >= 0) {
        lesson.order = parsedOrder;
      }
    }

    await lesson.save();

    return Response.json({
      success: true,
      message: "Lesson updated successfully.",
      lesson,
    });
  } catch (error) {
    console.error("Update Lesson Error:", error);

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
// DELETE LESSON
// ==========================================

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
          message: "Only instructors can delete lessons.",
        },
        { status: 403 },
      );
    }

    const resolvedParams = await params;

    const slug = resolvedParams?.slug;
    const sectionId = resolvedParams?.sectionId;
    const lessonId = resolvedParams?.lessonsId;

    console.log("Delete Lesson Params:", slug, sectionId, lessonId);

    if (!slug || !sectionId || !lessonId) {
      return Response.json(
        {
          success: false,
          message: "Course slug, section ID and lesson ID are required.",
          debug: {
            slug,
            sectionId,
            lessonId,
          },
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

    const lesson = await Lesson.findOne({
      _id: lessonId,
      section: section._id,
      course: course._id,
    });

    if (!lesson) {
      return Response.json(
        {
          success: false,
          message: "Lesson not found.",
        },
        { status: 404 },
      );
    }

    await Lesson.deleteOne({
      _id: lesson._id,
    });

    return Response.json({
      success: true,
      message: "Lesson deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Lesson Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
