"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaBookOpen,
  FaClock,
  FaGraduationCap,
  FaLayerGroup,
  FaUser,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PendingCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PENDING COURSES
  // ==========================================

  const fetchPendingCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/courses/pending");

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load pending courses.");
      }

      setCourses(data.courses || []);
    } catch (error) {
      console.error("Fetch Pending Courses Error:", error);

      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-5 w-32" />

            <Skeleton className="mt-4 h-10 w-72" />

            <Skeleton className="mt-3 h-5 w-96" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />

                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
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
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <FaBookOpen className="text-2xl" />
            </div>

            <h1 className="text-2xl font-bold">Unable to load courses</h1>

            <p className="mt-2 text-muted-foreground">{error}</p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/admin" />}
              >
                <FaArrowLeft className="mr-2" />
                Back to Admin
              </Button>

              <Button onClick={fetchPendingCourses}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

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
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaArrowLeft />
            Back to Admin
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Pending Courses
                </h1>

                <Badge variant="secondary">{courses.length}</Badge>
              </div>

              <p className="mt-2 text-muted-foreground">
                Review courses submitted by instructors.
              </p>
            </div>

            <Button variant="outline" onClick={fetchPendingCourses}>
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* CONTENT */}
      {/* ====================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Empty State */}

        {courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FaBookOpen className="text-2xl text-muted-foreground" />
              </div>

              <h2 className="text-xl font-semibold">No pending courses</h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                There are currently no courses waiting for admin review.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Course Grid */

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group overflow-hidden transition-shadow hover:shadow-lg"
              >
                {/* Thumbnail */}

                <div className="relative aspect-video bg-muted">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <FaBookOpen className="text-4xl" />
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <Badge className="border-0 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
                      Pending
                    </Badge>
                  </div>
                </div>

                {/* Content */}

                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-xl">
                    {course.title}
                  </CardTitle>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {course.shortDescription || course.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Instructor */}

                  <div className="flex items-center gap-3">
                    {course.instructor?.image ? (
                      <Image
                        src={course.instructor.image}
                        alt={course.instructor.name || "Instructor"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <FaUser className="text-sm text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Instructor
                      </p>

                      <p className="truncate text-sm font-medium">
                        {course.instructor?.name ||
                          course.instructor?.email ||
                          "Unknown Instructor"}
                      </p>
                    </div>
                  </div>

                  {/* Course Info */}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FaGraduationCap />
                        Level
                      </div>

                      <p className="mt-1 text-sm font-medium capitalize">
                        {course.level}
                      </p>
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FaLayerGroup />
                        Category
                      </div>

                      <p className="mt-1 truncate text-sm font-medium">
                        {course.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  {/* Duration / Price */}

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FaClock />
                      {course.duration || 0}{" "}
                      {course.duration === 1 ? "hour" : "hours"}
                    </div>

                    <div className="font-semibold">
                      {course.discountPrice > 0 &&
                      course.discountPrice < course.price ? (
                        <>
                          <span>৳{course.discountPrice}</span>

                          <span className="ml-2 text-xs text-muted-foreground line-through">
                            ৳{course.price}
                          </span>
                        </>
                      ) : course.price > 0 ? (
                        `৳${course.price}`
                      ) : (
                        "Free"
                      )}
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="flex gap-2 pt-1">
                    <Button
                      className="flex-1"
                      nativeButton={false}
                      render={<Link href={`/admin/courses/${course.slug}`} />}
                    >
                      View Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
