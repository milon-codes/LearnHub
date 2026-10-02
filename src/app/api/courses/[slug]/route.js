import { auth } from "@/auth";
import { connectDB } from "@/lib/db";

import Course from "@/models/Course";
import Section from "@/models/Section";
import Lesson from "@/models/Lesson";

export async function GET(request, { params }) {
  try {
    // ==========================================
    // 1. Get Slug
    // ==========================================

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

    // ==========================================
    // 2. Database
    // ==========================================

    await connectDB();

    // ==========================================
    // 3. Find Published Course
    // ==========================================

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
      status: "published",
    })
      .populate("instructor", "name avatar")
      .populate("category", "name slug")
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

    // ==========================================
    // 4. Get Sections
    // ==========================================

    const sections = await Section.find({
      course: course._id.toString(),
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    // ==========================================
    // 5. Get Lessons
    // ==========================================

    const lessons = await Lesson.find({
      course: course._id.toString(),
      isPublished: true,
    })
      .select("title description section type duration order isFree")
      .sort({ order: 1 })
      .lean();

    // ==========================================
    // 6. Attach Lessons to Sections
    // ==========================================

    const sectionsWithLessons = sections.map((section) => ({
      ...section,

      lessons: lessons
        .filter(
          (lesson) => lesson.section.toString() === section._id.toString(),
        )
        .sort((a, b) => a.order - b.order),
    }));

    // ==========================================
    // 7. Response
    // ==========================================

    return Response.json({
      success: true,
      message: "Course details fetched successfully.",
      course,
      sections: sectionsWithLessons,
    });
  } catch (error) {
    console.error("Course Details API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
