"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaGraduationCap,
  FaLanguage,
  FaPlayCircle,
  FaStar,
  FaTag,
  FaUsers,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailsPage() {
  const params = useParams();
  const slug = params?.slug;

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openSections, setOpenSections] = useState({});

  // ==========================================
  // FETCH COURSE DETAILS
  // ==========================================

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/courses/${slug}`);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load course.");
      }

      setCourse(data.course);
      setSections(data.sections || []);

      // Open first section by default
      if (data.sections?.length > 0) {
        setOpenSections({
          [data.sections[0]._id]: true,
        });
      }
    } catch (error) {
      console.error("Course Details Error:", error);

      setError(
        error.message || "Something went wrong while loading the course.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  // ==========================================
  // TOGGLE SECTION
  // ==========================================

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // ==========================================
  // FORMAT LEVEL
  // ==========================================

  const formatLevel = (level) => {
    if (!level) return "Beginner";

    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const hasDiscount =
    course?.discountPrice > 0 && course?.discountPrice < course?.price;

  const displayPrice = hasDiscount ? course?.discountPrice : course?.price;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Skeleton className="h-5 w-32" />

            <Skeleton className="mt-5 h-12 w-full max-w-3xl" />

            <Skeleton className="mt-4 h-6 w-full max-w-2xl" />

            <div className="mt-6 flex gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              <Skeleton className="aspect-video w-full rounded-xl" />

              <Skeleton className="mt-8 h-10 w-64" />

              <div className="mt-5 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>

            <Skeleton className="h-[450px] w-full rounded-xl" />
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <FaBookOpen className="text-2xl" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">Unable to load course</h1>

            <p className="mt-2 text-muted-foreground">{error}</p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/courses" />}
              >
                <FaArrowLeft className="mr-2" />
                Back to Courses
              </Button>

              <Button onClick={fetchCourse}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ==========================================
          HERO
      ========================================== */}

      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Back */}

          <Link
            href="/courses"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaArrowLeft />
            Back to Courses
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
            {/* Hero Content */}

            <div>
              {/* Category */}

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge>{course.category?.name || "Uncategorized"}</Badge>

                <Badge variant="secondary">{formatLevel(course.level)}</Badge>
              </div>

              {/* Title */}

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              {/* Short Description */}

              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {course.shortDescription}
              </p>

              {/* Rating */}

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />

                  <span className="font-semibold">
                    {course.rating?.toFixed(1) || "0.0"}
                  </span>

                  <span className="text-muted-foreground">
                    ({course.totalReviews || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <FaUsers />

                  <span>{course.totalStudents || 0} students</span>
                </div>
              </div>

              {/* Instructor */}

              <div className="mt-7 flex items-center gap-3">
                {course.instructor?.avatar ? (
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FaGraduationCap />
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Instructor</p>

                  <p className="font-semibold">
                    {course.instructor?.name || "Instructor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Thumbnail */}

            <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
              <div className="relative aspect-video bg-muted">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <FaBookOpen className="text-5xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAIN
      ========================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ======================================
              LEFT CONTENT
          ====================================== */}

          <div className="space-y-8">
            {/* What You'll Learn */}

            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold">What You&apos;ll Learn</h2>

                {course.whatYouWillLearn?.length > 0 ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <FaCheck className="text-xs" />
                        </div>

                        <span className="text-sm leading-6">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No learning objectives added yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Description */}

            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold">Course Description</h2>

                <p className="mt-5 whitespace-pre-line leading-8 text-muted-foreground">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}

            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold">Requirements</h2>

                {course.requirements?.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {course.requirements.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No requirements added.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Course Content */}

            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Course Content</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {sections.length}{" "}
                      {sections.length === 1 ? "section" : "sections"}
                    </p>
                  </div>
                </div>

                {/* No Sections */}

                {sections.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed p-8 text-center">
                    <FaBookOpen className="mx-auto text-3xl text-muted-foreground" />

                    <h3 className="mt-4 font-semibold">
                      Course content is coming soon
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Lessons will appear here once the instructor publishes
                      them.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {sections.map((section, index) => {
                      const isOpen = !!openSections[section._id];

                      return (
                        <div
                          key={section._id}
                          className="overflow-hidden rounded-xl border"
                        >
                          {/* Section Header */}

                          <button
                            type="button"
                            onClick={() => toggleSection(section._id)}
                            className="flex w-full items-center justify-between gap-4 bg-muted/30 px-4 py-4 text-left transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                                {index + 1}
                              </div>

                              <div>
                                <h3 className="font-semibold">
                                  {section.title}
                                </h3>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {section.lessons?.length || 0}{" "}
                                  {section.lessons?.length === 1
                                    ? "lesson"
                                    : "lessons"}
                                </p>
                              </div>
                            </div>

                            {isOpen ? (
                              <FaChevronUp className="shrink-0 text-sm text-muted-foreground" />
                            ) : (
                              <FaChevronDown className="shrink-0 text-sm text-muted-foreground" />
                            )}
                          </button>

                          {/* Lessons */}

                          {isOpen && (
                            <div className="border-t">
                              {section.lessons?.length > 0 ? (
                                <div className="divide-y">
                                  {section.lessons.map(
                                    (lesson, lessonIndex) => (
                                      <div
                                        key={lesson._id}
                                        className="flex items-center justify-between gap-4 px-4 py-4"
                                      >
                                        <div className="flex min-w-0 items-center gap-3">
                                          <FaPlayCircle className="shrink-0 text-primary" />

                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                              {lessonIndex + 1}. {lesson.title}
                                            </p>

                                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                              <span className="capitalize">
                                                {lesson.type}
                                              </span>

                                              {lesson.duration > 0 && (
                                                <span className="flex items-center gap-1">
                                                  <FaClock />
                                                  {lesson.duration} min
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {lesson.isFree && (
                                          <Badge
                                            variant="secondary"
                                            className="shrink-0"
                                          >
                                            Free Preview
                                          </Badge>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="px-4 py-5 text-sm text-muted-foreground">
                                  No published lessons in this section.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ======================================
              RIGHT SIDEBAR
          ====================================== */}

          <aside>
            <div className="sticky top-6">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Price */}

                  <div>
                    {hasDiscount ? (
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-bold">
                          ৳{course.discountPrice}
                        </span>

                        <span className="mb-1 text-lg text-muted-foreground line-through">
                          ৳{course.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold">
                        {course.price > 0 ? `৳${course.price}` : "Free"}
                      </span>
                    )}
                  </div>

                  {/* Discount */}

                  {hasDiscount && (
                    <Badge className="mt-3">
                      Save ৳{course.price - course.discountPrice}
                    </Badge>
                  )}

                  {/* Enroll */}

                  <Button size="lg" className="mt-6 w-full">
                    Enroll Now
                  </Button>

                  {/* Info */}

                  <div className="mt-6 space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <FaClock />

                        <span>Duration</span>
                      </div>

                      <span className="font-medium">
                        {course.duration} hours
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <FaGraduationCap />

                        <span>Level</span>
                      </div>

                      <span className="font-medium">
                        {formatLevel(course.level)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <FaLanguage />

                        <span>Language</span>
                      </div>

                      <span className="font-medium">{course.language}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <FaBookOpen />

                        <span>Lessons</span>
                      </div>

                      <span className="font-medium">
                        {sections.reduce(
                          (total, section) =>
                            total + (section.lessons?.length || 0),
                          0,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <FaUsers />

                        <span>Students</span>
                      </div>

                      <span className="font-medium">
                        {course.totalStudents || 0}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}

                  {course.tags?.length > 0 && (
                    <div className="mt-6 border-t pt-6">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <FaTag className="text-primary" />
                        Tags
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
