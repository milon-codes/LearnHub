import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section";
import Lesson from "@/models/Lesson";

// ==========================================
// GET ALL LESSONS OF A SECTION
// ==========================================

export async function GET(request, { params }) {
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
          message: "Only instructors can access lessons.",
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
    // 4. Database
    // ----------------------------------------

    await connectDB();

    // ----------------------------------------
    // 5. Find Instructor's Course
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
    // 6. Find Section
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
    // 7. Get Lessons
    // ----------------------------------------

    const lessons = await Lesson.find({
      section: section._id,
      course: course._id,
    }).sort({
      order: 1,
    });

    // ----------------------------------------
    // 8. Response
    // ----------------------------------------

    return Response.json({
      success: true,
      message: "Lessons fetched successfully.",
      lessons,
    });
  } catch (error) {
    console.error("Get Lessons Error:", error);

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
// CREATE LESSON
// ==========================================

export async function POST(request, { params }) {
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
          message: "Only instructors can create lessons.",
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

    // ----------------------------------------
    // 5. Validation
    // ----------------------------------------

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

    // Video lesson needs video URL
    if (type === "video" && !videoUrl?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Video URL is required for video lessons.",
        },
        { status: 400 },
      );
    }

    // Article lesson needs content
    if (type === "article" && !content?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Content is required for article lessons.",
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
    // 9. Calculate Lesson Order
    // ----------------------------------------

    let lessonOrder = Number(order);

    if (!Number.isFinite(lessonOrder) || lessonOrder < 0) {
      const lastLesson = await Lesson.findOne({
        section: section._id,
      }).sort({
        order: -1,
      });

      lessonOrder = lastLesson ? lastLesson.order + 1 : 0;
    }

    // ----------------------------------------
    // 10. Create Lesson
    // ----------------------------------------

    const lesson = await Lesson.create({
      title: title.trim(),
      description: description?.trim() || "",

      section: section._id,
      course: course._id,

      type,

      videoUrl: type === "video" ? videoUrl.trim() : "",

      content: type === "article" ? content.trim() : "",

      duration: Number(duration) || 0,

      order: lessonOrder,

      isFree: Boolean(isFree),

      isPublished: Boolean(isPublished),
    });

    // ----------------------------------------
    // 11. Response
    // ----------------------------------------

    return Response.json(
      {
        success: true,
        message: "Lesson created successfully.",
        lesson,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Lesson Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
