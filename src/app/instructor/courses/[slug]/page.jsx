"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaBookOpen,
  FaClock,
  FaEdit,
  FaGraduationCap,
  FaLanguage,
  FaLayerGroup,
  FaStar,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import CourseSections from "@/components/instructor/CourseSections";

export default function CourseManagePage() {
  const params = useParams();
  const slug = params?.slug;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Submit states
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // FETCH COURSE
  // ==========================================

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/instructor/courses/${slug}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load course.");
        return;
      }

      setCourse(data.course);
    } catch (error) {
      console.error("Fetch Course Error:", error);

      setError("Something went wrong while loading the course.");
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
  // SUBMIT COURSE FOR REVIEW
  // ==========================================

  const handleSubmitForReview = async () => {
    if (!course?.slug) return;

    const confirmed = window.confirm(
      "Are you sure you want to submit this course for admin review?",
    );

    if (!confirmed) return;

    try {
      setSubmitLoading(true);

      setSubmitMessage({
        type: "",
        text: "",
      });

      const res = await fetch(`/api/instructor/courses/${course.slug}/submit`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit course for review.");
      }

      // Update course immediately in UI
      setCourse((prev) => ({
        ...prev,
        ...(data.course || {}),
        status: data.course?.status || "pending",
        rejectionReason: data.course?.rejectionReason || "",
      }));

      setSubmitMessage({
        type: "success",
        text: data.message || "Course submitted for review successfully.",
      });
    } catch (error) {
      console.error("Submit Course Error:", error);

      setSubmitMessage({
        type: "error",
        text: error.message || "Failed to submit course for review.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    const styles = {
      draft:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",

      published:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    return styles[status] || styles.draft;
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (status) => {
    if (!status) return "Draft";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // ==========================================
  // FORMAT LEVEL
  // ==========================================

  const formatLevel = (level) => {
    if (!level) return "Beginner";

    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="mb-4 h-5 w-32" />

            <Skeleton className="h-10 w-2/3" />

            <Skeleton className="mt-3 h-5 w-1/2" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <Skeleton className="aspect-video w-full rounded-xl" />

            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // ERROR UI
  // ==========================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <FaBookOpen className="text-2xl" />
            </div>

            <h1 className="text-2xl font-bold">Unable to load course</h1>

            <p className="mt-2 text-muted-foreground">{error}</p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/instructor/courses" />}
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

  // ==========================================
  // STATUS CONDITIONS
  // ==========================================

  const canSubmit = course.status === "draft" || course.status === "rejected";

  const isPending = course.status === "pending";

  const isPublished = course.status === "published";

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-background">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back */}

          <Link
            href="/instructor/courses"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaArrowLeft />
            Back to My Courses
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              {/* Status */}

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className={`border-0 ${getStatusClass(course.status)}`}>
                  {formatStatus(course.status)}
                </Badge>

                <Badge variant="secondary">
                  {course.category?.name || "Uncategorized"}
                </Badge>
              </div>

              {/* Title */}

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-3 text-muted-foreground">
                {course.shortDescription ||
                  "Manage your course content and settings."}
              </p>
            </div>

            {/* Header Actions */}

            <div className="flex flex-wrap gap-2">
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={
                  <Link href={`/instructor/courses/${course.slug}/edit`} />
                }
              >
                <FaEdit className="mr-2" />
                Edit Course
              </Button>

              {/* Submit Button */}

              {canSubmit && (
                <Button
                  size="lg"
                  onClick={handleSubmitForReview}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />

                      {course.status === "rejected"
                        ? "Resubmit for Review"
                        : "Submit for Review"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ====================================== */}
      {/* SUBMIT MESSAGE */}
      {/* ====================================== */}
      {submitMessage.text && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              submitMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            {submitMessage.type === "success" ? (
              <FaCheckCircle className="mt-0.5 shrink-0" />
            ) : (
              <FaTimesCircle className="mt-0.5 shrink-0" />
            )}

            <span>{submitMessage.text}</span>
          </div>
        </div>
      )}
      {/* ====================================== */}
      {/* PENDING NOTICE */}
      {/* ====================================== */}
      {isPending && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-400">
            <FaHourglassHalf className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">Course is waiting for admin review.</p>

              <p className="mt-1 text-xs opacity-80">
                You can continue managing your course, but publishing will
                happen after admin approval.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ====================================== */}
      {/* PUBLISHED NOTICE */}
      {/* ====================================== */}
      {isPublished && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            <FaCheckCircle className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">This course is published.</p>

              <p className="mt-1 text-xs opacity-80">
                Students can now access this course.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ====================================== */}
      {/* REJECTED NOTICE */}
      {/* ====================================== */}
      {/* {course.status === "rejected" && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaTimesCircle className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">This course was rejected.</p>

              <p className="mt-1 text-xs opacity-80">
                Update the course if needed, then submit it again for review.
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* ====================================== */}
      {/* REJECTED NOTICE */}
      {/* ====================================== */}
      {course.status === "rejected" && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <div className="flex items-start gap-3">
              <FaTimesCircle className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-red-700 dark:text-red-400">
                  This course was rejected
                </p>

                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                  Please review the admin feedback, update your course, and
                  submit it again for review.
                </p>

                {/* Rejection Reason */}

                {course.rejectionReason?.trim() ? (
                  <div className="mt-4 rounded-lg border border-red-200 bg-background p-4 dark:border-red-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Admin Feedback
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
                      {course.rejectionReason}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-dashed border-red-200 p-4 dark:border-red-900">
                    <p className="text-sm text-muted-foreground">
                      No rejection reason was provided by the admin.
                    </p>
                  </div>
                )}

                {/* Actions */}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={
                      <Link href={`/instructor/courses/${course.slug}/edit`} />
                    }
                  >
                    <FaEdit className="mr-2" />
                    Edit Course
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSubmitForReview}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Resubmitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Resubmit for Review
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ====================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================== */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* ================================== */}
          {/* LEFT */}
          {/* ================================== */}

          <div className="space-y-8">
            {/* Course Thumbnail */}

            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <FaBookOpen className="text-5xl" />
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}

            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-line leading-7 text-muted-foreground">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            {/* What Students Will Learn */}

            <Card>
              <CardHeader>
                <CardTitle>What Students Will Learn</CardTitle>
              </CardHeader>

              <CardContent>
                {course.whatYouWillLearn?.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                          ✓
                        </div>

                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No learning objectives added yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>

              <CardContent>
                {course.requirements?.length > 0 ? (
                  <ul className="space-y-3">
                    {course.requirements.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No requirements added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ================================== */}
          {/* RIGHT */}
          {/* ================================== */}

          <div className="space-y-6">
            {/* Course Overview */}

            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaGraduationCap />

                    <span>Level</span>
                  </div>

                  <span className="font-medium">
                    {formatLevel(course.level)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaLanguage />

                    <span>Language</span>
                  </div>

                  <span className="font-medium">{course.language}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaClock />

                    <span>Duration</span>
                  </div>

                  <span className="font-medium">
                    {course.duration} {course.duration === 1 ? "hour" : "hours"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaUsers />

                    <span>Students</span>
                  </div>

                  <span className="font-medium">
                    {course.totalStudents || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaStar className="text-yellow-500" />

                    <span>Rating</span>
                  </div>

                  <span className="font-medium">
                    {course.rating?.toFixed(1) || "0.0"} (
                    {course.totalReviews || 0})
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>

              <CardContent>
                {course.discountPrice > 0 &&
                course.discountPrice < course.price ? (
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold">
                      ৳{course.discountPrice}
                    </span>

                    <span className="mb-1 text-sm text-muted-foreground line-through">
                      ৳{course.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">
                    {course.price > 0 ? `৳${course.price}` : "Free"}
                  </span>
                )}
              </CardContent>
            </Card>

            {/* Tags */}

            <Card>
              <CardHeader>
                <CardTitle>Course Tags</CardTitle>
              </CardHeader>

              <CardContent>
                {course.tags?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags added.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Course Content */}

            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <FaLayerGroup className="mx-auto mb-3 text-2xl text-muted-foreground" />

                  <h3 className="font-semibold">Sections & Lessons</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Start adding sections and lessons to your course.
                  </p>

                  <Button className="mt-4" disabled>
                    Manage Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Sections */}

        <CourseSections slug={slug} />
      </section>
    </main>
  );
}
