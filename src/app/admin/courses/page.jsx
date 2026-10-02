"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FaBookOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEye,
  FaSearch,
  FaTimesCircle,
  FaTrash,
  FaBan,
  FaCheck,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const statusTabs = [
  {
    value: "",
    label: "All Courses",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "published",
    label: "Published",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "draft",
    label: "Draft",
  },
];

export default function AdminCoursesPage() {
  // ==========================================
  // STATE
  // ==========================================

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [status, setStatus] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [actionLoading, setActionLoading] = useState("");

  const [actionMessage, setActionMessage] = useState({
    type: "",
    text: "",
  });

  const [rejectModal, setRejectModal] = useState({
    open: false,
    course: null,
  });

  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", pagination.currentPage);
      params.set("limit", pagination.limit);

      if (status) {
        params.set("status", status);
      }

      if (activeSearch) {
        params.set("search", activeSearch);
      }

      const res = await fetch(`/api/admin/courses?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
console.log(data, 'coruses data');

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch courses.");
      }

      setCourses(data.courses || []);

      setPagination((prev) => ({
        ...prev,
        ...(data.pagination || {}),
      }));
    } catch (error) {
      console.error("Admin Courses Fetch Error:", error);

      setError(error.message || "Something went wrong.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, status, activeSearch]);

  // ==========================================
  // INITIAL / FILTER FETCH
  // ==========================================

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    setActiveSearch(search.trim());
  };

  // ==========================================
  // STATUS CHANGE
  // ==========================================

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // REVIEW COURSE
  // ==========================================
  const handleReview = async (course, action) => {
    if (!course?.slug) return;

    if (action === "approve") {
      const confirmed = window.confirm(
        `Are you sure you want to approve "${course.title}"?`,
      );

      if (!confirmed) return;
    }

    if (action === "reject") {
      setRejectModal({
        open: true,
        course,
      });

      setRejectionReason("");

      return;
    }

    try {
      setActionLoading(`${action}-${course._id}`);

      setActionMessage({
        type: "",
        text: "",
      });

      const res = await fetch(`/api/admin/courses/${course.slug}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Course review failed.");
      }

      setActionMessage({
        type: "success",
        text: data.message || "Course updated successfully.",
      });

      await fetchCourses();
    } catch (error) {
      console.error("Course Review Error:", error);

      setActionMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // REJECT COURSE
  // ==========================================

  const handleRejectSubmit = async () => {
    const course = rejectModal.course;

    if (!course?.slug) return;

    if (!rejectionReason.trim()) {
      setActionMessage({
        type: "error",
        text: "Please provide a rejection reason.",
      });

      return;
    }

    try {
      setActionLoading(`reject-${course._id}`);

      const res = await fetch(`/api/admin/courses/${course.slug}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to reject course.");
      }

      setRejectModal({
        open: false,
        course: null,
      });

      setRejectionReason("");

      setActionMessage({
        type: "success",
        text: data.message || "Course rejected successfully.",
      });

      await fetchCourses();
    } catch (error) {
      console.error("Reject Course Error:", error);

      setActionMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // UNPUBLISH COURSE
  // ==========================================

  const handleUnpublish = async (course) => {
    if (!course?.slug) return;

    const confirmed = window.confirm(
      `Are you sure you want to unpublish "${course.title}"?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(`unpublish-${course._id}`);

      setActionMessage({
        type: "",
        text: "",
      });

      const res = await fetch(`/api/admin/courses/${course.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unpublish",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to unpublish course.");
      }

      setActionMessage({
        type: "success",
        text: data.message || "Course unpublished successfully.",
      });

      await fetchCourses();
    } catch (error) {
      console.error("Unpublish Course Error:", error);

      setActionMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // DELETE COURSE
  // ==========================================

  const handleDelete = async (course) => {
    if (!course?.slug) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${course.title}"?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(`delete-${course._id}`);

      setActionMessage({
        type: "",
        text: "",
      });

      const res = await fetch(`/api/admin/courses/${course.slug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete course.");
      }

      setActionMessage({
        type: "success",
        text: data.message || "Course deleted successfully.",
      });

      await fetchCourses();
    } catch (error) {
      console.error("Delete Course Error:", error);

      setActionMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setActionLoading("");
    }
  };

  {
    /* ====================================== */
  }
  {
    /* ACTION MESSAGE */
  }
  {
    /* ====================================== */
  }

  {
    actionMessage.text && (
      <div
        className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
          actionMessage.type === "success"
            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
        }`}
      >
        {actionMessage.type === "success" ? (
          <FaCheckCircle className="mt-0.5 shrink-0" />
        ) : (
          <FaTimesCircle className="mt-0.5 shrink-0" />
        )}

        <span>{actionMessage.text}</span>
      </div>
    );
  }

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (courseStatus) => {
    const styles = {
      draft:
        "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",

      pending:
        "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-400",

      published:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400",

      rejected:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400",
    };

    return (
      styles[courseStatus] || "border-border bg-muted text-muted-foreground"
    );
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (courseStatus) => {
    if (!courseStatus) return "Unknown";

    return courseStatus.charAt(0).toUpperCase() + courseStatus.slice(1);
  };

  // ==========================================
  // PRICE
  // ==========================================

  const getCoursePrice = (course) => {
    if (course.discountPrice > 0) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold">৳{course.discountPrice}</span>

          {course.price > course.discountPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ৳{course.price}
            </span>
          )}
        </div>
      );
    }

    if (course.price > 0) {
      return <span className="font-semibold">৳{course.price}</span>;
    }

    return <Badge variant="secondary">Free</Badge>;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && courses.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-3 h-5 w-96 max-w-full" />
          </div>

          <Skeleton className="mb-6 h-12 w-full rounded-xl" />

          <div className="mb-6 flex gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-28 shrink-0 rounded-lg" />
            ))}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>

            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && courses.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <FaBookOpen className="text-2xl" />
            </div>

            <h1 className="text-2xl font-bold">Unable to load courses</h1>

            <p className="mt-2 text-sm text-muted-foreground">{error}</p>

            <Button className="mt-6" onClick={fetchCourses}>
              Try Again
            </Button>
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FaBookOpen />
                <span>Administration</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Course Management
              </h1>

              <p className="mt-2 text-muted-foreground">
                Manage courses, review submissions, and monitor course status.
              </p>
            </div>

            <div className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">Pending Courses</p>

             {/* আপনার কোডটি এভাবে পরিবর্তন করুন */}
<p className="text-2xl font-bold">
  {courses.filter(item => item.status === 'draft').length}
</p>

            </div>

            <div className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">Total Courses</p>

              <p className="text-2xl font-bold">{pagination.totalCourses}</p>
            </div>
          </div>
        </div>

        

        {/* ====================================== */}
        {/* SEARCH */}
        {/* ====================================== */}

        <Card className="mb-6">
          <CardContent className="p-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by course title..."
                  className="pl-9"
                />
              </div>

              <Button type="submit">
                <FaSearch className="mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ====================================== */}
        {/* STATUS TABS */}
        {/* ====================================== */}

        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {statusTabs.map((tab) => {
              const active = status === tab.value;

              return (
                <Button
                  key={tab.value || "all"}
                  variant={active ? "default" : "outline"}
                  onClick={() => handleStatusChange(tab.value)}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* ====================================== */}
        {/* ERROR MESSAGE */}
        {/* ====================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaTimesCircle className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* ====================================== */}
        {/* COURSE TABLE */}
        {/* ====================================== */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>
                {status ? `${formatStatus(status)} Courses` : "All Courses"}
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                {pagination.totalCourses} course
                {pagination.totalCourses !== 1 ? "s" : ""}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FaBookOpen className="text-2xl text-muted-foreground" />
                </div>

                <h3 className="text-lg font-semibold">No courses found</h3>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  No courses match your current search or filter.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-sm">
                        <th className="px-6 py-4 font-medium">Course</th>

                        <th className="px-6 py-4 font-medium">Instructor</th>

                        <th className="px-6 py-4 font-medium">Category</th>

                        <th className="px-6 py-4 font-medium">Price</th>

                        <th className="px-6 py-4 font-medium">Students</th>

                        <th className="px-6 py-4 font-medium">Status</th>

                        <th className="px-6 py-4 text-right font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {courses.map((course) => (
                        <tr
                          key={course._id}
                          className="border-b last:border-0 hover:bg-muted/20"
                        >
                          {/* Course */}

                          <td className="px-6 py-4">
                            <div className="flex min-w-[260px] items-center gap-3">
                              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                                {course.thumbnail ? (
                                  <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <FaBookOpen className="text-muted-foreground" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold">
                                  {course.title}
                                </p>

                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                  {course.level
                                    ? course.level.charAt(0).toUpperCase() +
                                      course.level.slice(1)
                                    : "Beginner"}{" "}
                                  • {course.language}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Instructor */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold">
                                {course.instructor?.avatar ? (
                                  <Image
                                    src={course.instructor.avatar}
                                    alt={course.instructor.name || "Instructor"}
                                    width={32}
                                    height={32}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  course.instructor?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "I"
                                )}
                              </div>

                              <span className="max-w-[140px] truncate text-sm">
                                {course.instructor?.name || "Unknown"}
                              </span>
                            </div>
                          </td>

                          {/* Category */}

                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {course.category?.name || "Uncategorized"}
                            </span>
                          </td>

                          {/* Price */}

                          <td className="px-6 py-4">
                            {getCoursePrice(course)}
                          </td>

                          {/* Students */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <FaUsers className="text-muted-foreground" />
                              {course.totalStudents || 0}
                            </div>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={getStatusClass(course.status)}
                            >
                              {formatStatus(course.status)}
                            </Badge>
                          </td>

                          {/* Action */}
                          {/* Action */}

                          <td className="px-6 py-4">
                            <div className="flex flex-wrap justify-end gap-2">
                              {/* View */}

                              <Button
                                variant="outline"
                                size="sm"
                                nativeButton={false}
                                render={
                                  <Link href={`/admin/courses/${course.slug}`} />
                                }
                              >
                                <FaEye className="mr-2" />
                                View
                              </Button>

                              {/* Pending Actions */}

                              {course.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleReview(course, "approve")
                                    }
                                    disabled={
                                      actionLoading === `approve-${course._id}`
                                    }
                                  >
                                    {actionLoading ===
                                    `approve-${course._id}` ? (
                                      <FaSpinner className="mr-2 animate-spin" />
                                    ) : (
                                      <FaCheck className="mr-2" />
                                    )}
                                    Approve
                                  </Button>

                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleReview(course, "reject")
                                    }
                                    disabled={
                                      actionLoading === `reject-${course._id}`
                                    }
                                  >
                                    <FaTimesCircle className="mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}

                              {/* Published Action */}

                              {course.status === "published" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUnpublish(course)}
                                  disabled={
                                    actionLoading === `unpublish-${course._id}`
                                  }
                                >
                                  {actionLoading ===
                                  `unpublish-${course._id}` ? (
                                    <FaSpinner className="mr-2 animate-spin" />
                                  ) : (
                                    <FaBan className="mr-2" />
                                  )}
                                  Unpublish
                                </Button>
                              )}

                              {/* Delete */}

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(course)}
                                disabled={
                                  actionLoading === `delete-${course._id}`
                                }
                              >
                                {actionLoading === `delete-${course._id}` ? (
                                  <FaSpinner className="mr-2 animate-spin" />
                                ) : (
                                  <FaTrash className="mr-2" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet Cards */}

                <div className="grid gap-4 p-4 lg:hidden">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="rounded-xl border bg-card p-4"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FaBookOpen className="text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-semibold">{course.title}</h3>

                            <Badge
                              variant="outline"
                              className={getStatusClass(course.status)}
                            >
                              {formatStatus(course.status)}
                            </Badge>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {course.instructor?.name || "Unknown Instructor"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {course.category?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>

                          <div className="mt-1 text-sm">
                            {getCoursePrice(course)}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Students
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                            <FaUsers className="text-muted-foreground" />
                            {course.totalStudents || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Duration
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                            <FaClock className="text-muted-foreground" />
                            {course.duration || 0}h
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          className="w-full"
                          variant="outline"
                          nativeButton={false}
                          render={<Link href={`/courses/${course.slug}`} />}
                        >
                          <FaEye className="mr-2" />
                          View Course
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ====================================== */}
        {/* PAGINATION */}
        {/* ====================================== */}

        {pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <FaChevronLeft className="mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: pagination.totalPages,
                  },
                  (_, index) => index + 1,
                )
                  .filter((page) => {
                    if (pagination.totalPages <= 5) {
                      return true;
                    }

                    if (page === 1) return true;
                    if (page === pagination.totalPages) return true;

                    return Math.abs(page - pagination.currentPage) <= 1;
                  })
                  .map((page) => (
                    <Button
                      key={page}
                      variant={
                        page === pagination.currentPage ? "default" : "outline"
                      }
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
                <FaChevronRight className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ====================================== */}
        {/* FOOTER INFO */}
        {/* ====================================== */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FaCheckCircle />
          <span>Course management is protected by admin authorization.</span>
        </div>
      </div>

      {/* ====================================== */}
      {/* REJECT MODAL */}
      {/* ====================================== */}

      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Reject Course</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Please provide a reason for rejecting this course.
              </p>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-medium">Course</p>

              <div className="rounded-lg bg-muted p-3 text-sm">
                {rejectModal.course?.title}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Rejection Reason
              </label>

              <textarea
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Explain why this course is being rejected..."
                rows={5}
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectModal({
                    open: false,
                    course: null,
                  });

                  setRejectionReason("");
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleRejectSubmit}
                disabled={
                  !rejectionReason.trim() ||
                  actionLoading === `reject-${rejectModal.course?._id}`
                }
              >
                {actionLoading === `reject-${rejectModal.course?._id}` ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-2" />
                    Reject Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
