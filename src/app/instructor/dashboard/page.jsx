"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FaBookOpen,
  FaUsers,
  FaStar,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaPlus,
  FaArrowRight,
  FaChartLine,
  FaExclamationCircle,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statCards = [
  {
    key: "totalCourses",
    title: "Total Courses",
    icon: FaBookOpen,
  },
  {
    key: "totalStudents",
    title: "Total Students",
    icon: FaUsers,
  },
  {
    key: "averageRating",
    title: "Average Rating",
    icon: FaStar,
  },
  {
    key: "totalRevenue",
    title: "Estimated Revenue",
    icon: FaMoneyBillWave,
  },
];

const statusConfig = {
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  draft: {
    label: "Draft",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  pending: {
    label: "Pending",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export default function InstructorDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/instructor/dashboard");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load dashboard.");
      }

      setDashboard(data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center px-6 py-10 text-center">
              <FaExclamationCircle className="mb-4 text-4xl text-red-500" />

              <h2 className="text-xl font-semibold">
                Failed to load dashboard
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">{error}</p>

              <Button type="button" className="mt-6" onClick={fetchDashboard}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const stats = dashboard?.stats || {};
  const recentCourses = dashboard?.recentCourses || [];

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Instructor Panel</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your courses and track your teaching performance.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href="/instructor/courses" />}
          >
            Course
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/instructor/courses/create" />}
          >
            <FaPlus className="mr-2" />
            Create Course
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            let value = stats[stat.key] ?? 0;

            if (stat.key === "totalRevenue") {
              value = `৳${Number(value).toLocaleString()}`;
            }

            if (stat.key === "averageRating") {
              value = Number(value).toFixed(1);
            }

            return (
              <Card
                key={stat.key}
                className="border-border/60 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Course Status */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            icon={FaCheckCircle}
            title="Published"
            value={stats.publishedCourses}
            iconClass="text-emerald-500"
          />

          <StatusCard
            icon={FaFileAlt}
            title="Draft"
            value={stats.draftCourses}
            iconClass="text-yellow-500"
          />

          <StatusCard
            icon={FaClock}
            title="Pending"
            value={stats.pendingCourses}
            iconClass="text-blue-500"
          />

          <StatusCard
            icon={FaExclamationCircle}
            title="Rejected"
            value={stats.rejectedCourses}
            iconClass="text-red-500"
          />
        </div>

        {/* Quick Overview */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Course Overview</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    A quick look at your course performance.
                  </p>
                </div>

                <FaChartLine className="text-xl text-primary" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OverviewItem
                  label="Total Reviews"
                  value={stats.totalReviews || 0}
                />

                <OverviewItem
                  label="Total Students"
                  value={stats.totalStudents || 0}
                />

                <OverviewItem
                  label="Published Courses"
                  value={stats.publishedCourses || 0}
                />

                <OverviewItem
                  label="Average Rating"
                  value={`${Number(stats.averageRating || 0).toFixed(1)} / 5`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Quick Actions</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your instructor account.
              </p>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/instructor/courses/create"
                  icon={FaPlus}
                  title="Create Course"
                />

                <QuickAction
                  href="/instructor/courses"
                  icon={FaBookOpen}
                  title="My Courses"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Recent Courses</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your latest created courses.
              </p>
            </div>

            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/instructor/courses" />}
            >
              View All
              <FaArrowRight className="ml-2" />
            </Button>
          </div>

          {recentCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center px-6 py-12 text-center">
                <FaBookOpen className="text-4xl text-muted-foreground/50" />

                <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Create your first course and start building your learning
                  content.
                </p>

                <Button
                  className="mt-5"
                  nativeButton={false}
                  render={<Link href="/instructor/courses/create" />}
                >
                  <FaPlus className="mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recentCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatusCard({ icon: Icon, title, value, iconClass }) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-1 text-2xl font-bold">{value || 0}</p>
        </div>

        <Icon className={`text-2xl ${iconClass}`} />
      </CardContent>
    </Card>
  );
}

function OverviewItem({ label, value }) {
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      nativeButton={false}
      render={<Link href={href} />}
    >
      <Icon className="mr-3" />
      {title}
      <FaArrowRight className="ml-auto text-xs" />
    </Button>
  );
}

function CourseCard({ course }) {
  const status = statusConfig[course.status] || statusConfig.draft;

  return (
    <Card className="group overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FaBookOpen className="text-4xl text-muted-foreground/40" />
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge className={status.className}>{status.label}</Badge>

          <span className="text-xs text-muted-foreground">
            {course.category?.name || "Uncategorized"}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-lg font-semibold">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.shortDescription ||
            course.description ||
            "No description available."}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FaUsers />
            {course.totalStudents || 0}
          </span>

          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            {Number(course.rating || 0).toFixed(1)}
          </span>
        </div>

        <div className="mt-5">
          <Button
            variant="outline"
            className="w-full"
            nativeButton={false}
            render={<Link href={`/instructor/courses/${course.slug}`} />}
          >
            Manage Course
            <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="mt-3 h-4 w-80 rounded bg-muted" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-xl bg-muted" />
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 rounded-xl bg-muted" />
            ))}
          </div>

          <div className="mt-8 h-64 rounded-xl bg-muted" />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-80 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
