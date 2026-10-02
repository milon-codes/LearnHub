"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCheck,
  FaClock,
  FaGraduationCap,
  FaLanguage,
  FaLayerGroup,
  FaTag,
  FaTimes,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCourseReviewPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params?.slug;

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // FETCH COURSE
  // ==========================================

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/admin/courses/${slug}`);

      const data = await res.json();
      console.log(data, "data");

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load course.");
      }

      setCourse(data.course);
    } catch (error) {
      console.error("Admin Course Fetch Error:", error);

      setError(error.message || "Something went wrong.");
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
  // REVIEW COURSE
  // ==========================================

  const handleReview = async (action) => {
    if (action === "reject") {
      if (!rejectionReason.trim()) {
        setError("Please enter a rejection reason.");
        return;
      }
    }

    try {
      setReviewing(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/admin/courses/${slug}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Course review failed.");
      }

      setCourse(data.course);

      setSuccess(data.message);

      setShowReject(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Course Review Error:", error);

      setError(error.message || "Something went wrong.");
    } finally {
      setReviewing(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const formatLevel = (level) => {
    if (!level) return "Beginner";

    return level.charAt(0).toUpperCase() + level.slice(1);
  };

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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-5 w-32" />

            <Skeleton className="mt-5 h-10 w-2/3" />

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
  // ERROR
  // ==========================================

  if (error && !course) {
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
                render={<Link href="/admin/courses/pending" />}
              >
                <FaArrowLeft className="mr-2" />
                Back to Pending
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

  const isPending = course.status === "pending";

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
          <Link
            href="/admin/courses/pending"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaArrowLeft />
            Back to Pending Courses
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className={`border-0 ${getStatusClass(course.status)}`}>
                  {course.status?.charAt(0).toUpperCase() +
                    course.status?.slice(1)}
                </Badge>

                <Badge variant="secondary">
                  {course.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-3 max-w-3xl text-muted-foreground">
                {course.shortDescription || course.description}
              </p>
            </div>

            {/* ACTIONS */}

            {isPending && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={() => handleReview("approve")}
                  disabled={reviewing}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <FaCheck className="mr-2" />

                  {reviewing ? "Processing..." : "Approve Course"}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setShowReject(!showReject)}
                  disabled={reviewing}
                >
                  <FaTimes className="mr-2" />
                  Reject Course
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* ALERTS */}
      {/* ====================================== */}

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}
      </section>

      {/* ====================================== */}
      {/* REJECT FORM */}
      {/* ====================================== */}

      {showReject && isPending && (
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-lg">Reject Course</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason so the instructor understands what needs
                to be improved.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Example: Please improve the course description and add more detailed learning objectives."
                rows={4}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReject(false);
                    setRejectionReason("");
                  }}
                  disabled={reviewing}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleReview("reject")}
                  disabled={reviewing}
                >
                  {reviewing ? "Rejecting..." : "Confirm Rejection"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
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
            {/* Thumbnail */}

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

            {/* What Students Learn */}

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
                          <FaCheck />
                        </div>

                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No learning objectives added.
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
                    No requirements added.
                  </p>
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
                        <FaTag className="mr-1" />
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
          </div>

          {/* ================================== */}
          {/* RIGHT */}
          {/* ================================== */}

          <div className="space-y-6">
            {/* Instructor */}

            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  {course.instructor?.image ? (
                    <Image
                      src={course.instructor.image}
                      alt={course.instructor.name || "Instructor"}
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <FaUser className="text-xl text-muted-foreground" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold">
                      {course.instructor?.name || "Unknown Instructor"}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {course.instructor?.email || "No email"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Overview */}

            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaGraduationCap />
                    Level
                  </div>

                  <span className="font-medium">
                    {formatLevel(course.level)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaLanguage />
                    Language
                  </div>

                  <span className="font-medium">
                    {course.language || "English"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaClock />
                    Duration
                  </div>

                  <span className="font-medium">
                    {course.duration || 0}{" "}
                    {course.duration === 1 ? "hour" : "hours"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FaUsers />
                    Students
                  </div>

                  <span className="font-medium">
                    {course.totalStudents || 0}
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
                    Course content will be reviewed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
