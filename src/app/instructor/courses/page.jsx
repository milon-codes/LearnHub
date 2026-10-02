"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaBookOpen,
  FaClock,
  FaEdit,
  FaPlus,
  FaStar,
  FaUsers,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/instructor/courses");
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load courses.");
        return;
      }

      setCourses(data.courses || []);
    } catch (error) {
      console.error("Fetch Courses Error:", error);
      setError("Something went wrong while loading courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const formatStatus = (status) => {
    if (!status) return "Draft";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FaBookOpen className="text-primary" />
                <span>Instructor Dashboard</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Courses
              </h1>

              <p className="mt-2 max-w-2xl text-muted-foreground">
                Manage your courses, track their status, and continue building
                your learning content.
              </p>
            </div>

            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/instructor/courses/create" />}
            >
              <FaPlus className="mr-2" />
              Create Course
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        {!loading && !error && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FaBookOpen />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                  <FaUsers />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">
                    {courses.reduce(
                      (total, course) => total + (course.totalStudents || 0),
                      0,
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600">
                  <FaStar />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold">
                    {courses.length
                      ? (
                          courses.reduce(
                            (total, course) => total + (course.rating || 0),
                            0,
                          ) / courses.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <FaClock />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">
                    {
                      courses.filter((course) => course.status === "published")
                        .length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />

                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <FaBookOpen />
              </div>

              <h2 className="text-xl font-semibold">Unable to load courses</h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {error}
              </p>

              <Button onClick={fetchCourses} className="mt-6">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty */}
        {!loading && !error && courses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FaBookOpen className="text-2xl" />
              </div>

              <h2 className="text-2xl font-bold">No courses yet</h2>

              <p className="mt-2 max-w-md text-muted-foreground">
                You haven&apos;t created any courses yet. Start creating your
                first course and share your knowledge with students.
              </p>

              <Button
                className="mt-6"
                nativeButton={false}
                render={<Link href="/instructor/courses/create" />}
              >
                <FaPlus className="mr-2" />
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Course Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <FaBookOpen className="text-4xl" />
                    </div>
                  )}

                  {/* Status */}
                  <div className="absolute left-3 top-3">
                    <Badge
                      className={`border-0 ${getStatusClass(course.status)}`}
                    >
                      {formatStatus(course.status)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Category */}
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
                    {course.category?.name || "Uncategorized"}
                  </div>

                  {/* Title */}
                  <h2 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7">
                    {course.title}
                  </h2>

                  {/* Short Description */}
                  <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-muted-foreground">
                    {course.shortDescription ||
                      "No short description available."}
                  </p>

                  {/* Course Info */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="secondary">{course.level}</Badge>

                    <Badge variant="secondary">{course.language}</Badge>

                    <Badge variant="secondary">
                      {course.duration}{" "}
                      {course.duration === 1 ? "hour" : "hours"}
                    </Badge>
                  </div>

                  {/* Rating / Students */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      <span className="font-medium text-foreground">
                        {course.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span>({course.totalReviews || 0})</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <FaUsers />
                      <span>{course.totalStudents || 0}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      {course.discountPrice > 0 &&
                      course.discountPrice < course.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">
                            ৳{course.discountPrice}
                          </span>

                          <span className="text-sm text-muted-foreground line-through">
                            ৳{course.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold">
                          {course.price > 0 ? `৳${course.price}` : "Free"}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/instructor/courses/${course.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      Manage
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>

                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    nativeButton={false}
                    render={
                      <Link href={`/instructor/courses/${course.slug}/edit`} />
                    }
                  >
                    <FaEdit className="mr-2" />
                    Edit Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   FaArrowRight,
//   FaBookOpen,
//   FaCheckCircle,
//   FaClock,
//   FaEdit,
//   FaPlus,
//   FaRedo,
//   FaStar,
//   FaUsers,
// } from "react-icons/fa";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function InstructorCoursesPage() {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [submittingId, setSubmittingId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch("/api/courses");
//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Failed to load courses.");
//         return;
//       }

//       setCourses(data.courses || []);
//     } catch (error) {
//       console.error("Fetch Courses Error:", error);
//       setError("Something went wrong while loading courses.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // ========================================
//   // Submit Course Again
//   // ========================================

//   const handleSubmitAgain = async (course) => {
//     try {
//       setSubmittingId(course._id);
//       setError("");
//       setSuccessMessage("");

//       const res = await fetch(`/api/courses/${course.slug}/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Failed to submit course for review.");
//         return;
//       }

//       // Update UI immediately
//       setCourses((prevCourses) =>
//         prevCourses.map((item) =>
//           item._id === course._id
//             ? {
//                 ...item,
//                 status: "pending",
//                 rejectionReason: "",
//               }
//             : item,
//         ),
//       );

//       setSuccessMessage("Course submitted for review successfully.");
//     } catch (error) {
//       console.error("Submit Again Error:", error);

//       setError("Something went wrong while submitting the course.");
//     } finally {
//       setSubmittingId(null);
//     }
//   };

//   const getStatusClass = (status) => {
//     const styles = {
//       draft:
//         "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

//       pending:
//         "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",

//       published:
//         "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

//       rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//     };

//     return styles[status] || styles.draft;
//   };

//   const formatStatus = (status) => {
//     if (!status) return "Draft";

//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   return (
//     <main className="min-h-screen bg-background">
//       {/* ========================================
//           Header
//       ======================================== */}

//       <section className="border-b bg-muted/20">
//         <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
//                 <FaBookOpen className="text-primary" />
//                 <span>Instructor Dashboard</span>
//               </div>

//               <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//                 My Courses
//               </h1>

//               <p className="mt-2 max-w-2xl text-muted-foreground">
//                 Manage your courses, track their status, and continue building
//                 your learning content.
//               </p>
//             </div>

//             <Button
//               size="lg"
//               nativeButton={false}
//               render={<Link href="/instructor/courses/create" />}
//             >
//               <FaPlus className="mr-2" />
//               Create Course
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* ========================================
//           Content
//       ======================================== */}

//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Success Message */}

//         {successMessage && (
//           <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
//             <FaCheckCircle className="mt-0.5 shrink-0" />

//             <div>
//               <p className="font-semibold">Success</p>
//               <p className="mt-1">{successMessage}</p>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}

//         {error && (
//           <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
//             <p className="font-semibold">Something went wrong</p>
//             <p className="mt-1">{error}</p>
//           </div>
//         )}

//         {/* ========================================
//             Stats
//         ======================================== */}

//         {!loading && !error && (
//           <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardContent className="flex items-center gap-4 p-5">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
//                   <FaBookOpen />
//                 </div>

//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Courses</p>

//                   <p className="text-2xl font-bold">{courses.length}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center gap-4 p-5">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
//                   <FaUsers />
//                 </div>

//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Total Students
//                   </p>

//                   <p className="text-2xl font-bold">
//                     {courses.reduce(
//                       (total, course) => total + (course.totalStudents || 0),
//                       0,
//                     )}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center gap-4 p-5">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600">
//                   <FaStar />
//                 </div>

//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Average Rating
//                   </p>

//                   <p className="text-2xl font-bold">
//                     {courses.length
//                       ? (
//                           courses.reduce(
//                             (total, course) => total + (course.rating || 0),
//                             0,
//                           ) / courses.length
//                         ).toFixed(1)
//                       : "0.0"}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center gap-4 p-5">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
//                   <FaClock />
//                 </div>

//                 <div>
//                   <p className="text-sm text-muted-foreground">Published</p>

//                   <p className="text-2xl font-bold">
//                     {
//                       courses.filter((course) => course.status === "published")
//                         .length
//                     }
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* ========================================
//             Loading
//         ======================================== */}

//         {loading && (
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <Card key={index} className="overflow-hidden">
//                 <Skeleton className="aspect-video w-full" />

//                 <CardContent className="space-y-4 p-5">
//                   <Skeleton className="h-5 w-3/4" />
//                   <Skeleton className="h-4 w-1/2" />
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-10 w-full" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* ========================================
//             Empty
//         ======================================== */}

//         {!loading && !error && courses.length === 0 && (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
//               <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                 <FaBookOpen className="text-2xl" />
//               </div>

//               <h2 className="text-2xl font-bold">No courses yet</h2>

//               <p className="mt-2 max-w-md text-muted-foreground">
//                 You haven&apos;t created any courses yet. Start creating your
//                 first course and share your knowledge with students.
//               </p>

//               <Button
//                 className="mt-6"
//                 nativeButton={false}
//                 render={<Link href="/instructor/courses/create" />}
//               >
//                 <FaPlus className="mr-2" />
//                 Create Your First Course
//               </Button>
//             </CardContent>
//           </Card>
//         )}

//         {/* ========================================
//             Course Grid
//         ======================================== */}

//         {!loading && !error && courses.length > 0 && (
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {courses.map((course) => (
//               <Card
//                 key={course._id}
//                 className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//               >
//                 {/* Thumbnail */}

//                 <div className="relative aspect-video overflow-hidden bg-muted">
//                   {course.thumbnail ? (
//                     <Image
//                       src={course.thumbnail}
//                       alt={course.title}
//                       fill
//                       className="object-cover transition-transform duration-500 group-hover:scale-105"
//                       sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
//                     />
//                   ) : (
//                     <div className="flex h-full items-center justify-center text-muted-foreground">
//                       <FaBookOpen className="text-4xl" />
//                     </div>
//                   )}

//                   {/* Status */}

//                   <div className="absolute left-3 top-3">
//                     <Badge
//                       className={`border-0 ${getStatusClass(course.status)}`}
//                     >
//                       {formatStatus(course.status)}
//                     </Badge>
//                   </div>
//                 </div>

//                 <CardContent className="p-5">
//                   {/* Category */}

//                   <div className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
//                     {course.category?.name || "Uncategorized"}
//                   </div>

//                   {/* Title */}

//                   <h2 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7">
//                     {course.title}
//                   </h2>

//                   {/* Description */}

//                   <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-muted-foreground">
//                     {course.shortDescription ||
//                       "No short description available."}
//                   </p>

//                   {/* Course Info */}

//                   <div className="mt-5 flex flex-wrap gap-2">
//                     <Badge variant="secondary">{course.level}</Badge>

//                     <Badge variant="secondary">{course.language}</Badge>

//                     <Badge variant="secondary">
//                       {course.duration}{" "}
//                       {course.duration === 1 ? "hour" : "hours"}
//                     </Badge>
//                   </div>

//                   {/* Rating / Students */}

//                   <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <FaStar className="text-yellow-500" />

//                       <span className="font-medium text-foreground">
//                         {course.rating?.toFixed(1) || "0.0"}
//                       </span>

//                       <span>({course.totalReviews || 0})</span>
//                     </div>

//                     <div className="flex items-center gap-1">
//                       <FaUsers />

//                       <span>{course.totalStudents || 0}</span>
//                     </div>
//                   </div>

//                   {/* Price */}

//                   <div className="mt-5 flex items-end justify-between">
//                     <div>
//                       {course.discountPrice > 0 &&
//                       course.discountPrice < course.price ? (
//                         <div className="flex items-center gap-2">
//                           <span className="text-xl font-bold">
//                             ৳{course.discountPrice}
//                           </span>

//                           <span className="text-sm text-muted-foreground line-through">
//                             ৳{course.price}
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-xl font-bold">
//                           {course.price > 0 ? `৳${course.price}` : "Free"}
//                         </span>
//                       )}
//                     </div>

//                     <Link
//                       href={`/instructor/courses/${course.slug}`}
//                       className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
//                     >
//                       Manage
//                       <FaArrowRight className="text-xs" />
//                     </Link>
//                   </div>

//                   {/* ========================================
//                         Rejected Course Reason
//                     ======================================== */}

//                   {course.status === "rejected" && (
//                     <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
//                       <div className="flex items-start gap-3">
//                         <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
//                           <FaRedo className="text-xs" />
//                         </div>

//                         <div className="min-w-0">
//                           <p className="text-sm font-semibold text-red-700 dark:text-red-400">
//                             Course needs changes
//                           </p>

//                           <p className="mt-1 text-sm leading-6 text-red-600/90 dark:text-red-300/80">
//                             {course.rejectionReason ||
//                               "The admin rejected this course. Please review and update your course."}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* ========================================
//                         Edit Button
//                     ======================================== */}

//                   <Button
//                     variant="outline"
//                     className="mt-4 w-full"
//                     nativeButton={false}
//                     render={
//                       <Link href={`/instructor/courses/${course.slug}/edit`} />
//                     }
//                   >
//                     <FaEdit className="mr-2" />
//                     Edit Course
//                   </Button>

//                   {/* ========================================
//                         Submit Again
//                     ======================================== */}

//                   {course.status === "rejected" && (
//                     <Button
//                       className="mt-3 w-full"
//                       onClick={() => handleSubmitAgain(course)}
//                       disabled={submittingId === course._id}
//                     >
//                       {submittingId === course._id ? (
//                         <>
//                           <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <FaRedo className="mr-2" />
//                           Submit Again
//                         </>
//                       )}
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }
