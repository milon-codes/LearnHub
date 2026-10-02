"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBookOpen,
  FaSearch,
  FaFilter,
  FaStar,
  FaUsers,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaGraduationCap,
  FaLayerGroup,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const levels = [
  {
    value: "",
    label: "All Levels",
  },
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "advanced",
    label: "Advanced",
  },
];

const priceOptions = [
  {
    value: "",
    label: "All Prices",
  },
  {
    value: "free",
    label: "Free",
  },
  {
    value: "paid",
    label: "Paid",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "rating",
    label: "Highest Rated",
  },
  {
    value: "students",
    label: "Most Popular",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
];

export default function CoursesPage() {
  // ========================================
  // Courses
  // ========================================

  const [courses, setCourses] = useState([]);

  // ========================================
  // Categories
  // ========================================

  const [categories, setCategories] = useState([]);

  // ========================================
  // Loading
  // ========================================

  const [loading, setLoading] = useState(true);

  const [categoryLoading, setCategoryLoading] = useState(true);

  // ========================================
  // Error
  // ========================================

  const [error, setError] = useState("");

  // ========================================
  // Search
  // ========================================

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  // ========================================
  // Filters
  // ========================================

  const [category, setCategory] = useState("");

  const [level, setLevel] = useState("");

  const [price, setPrice] = useState("");

  const [sort, setSort] = useState("newest");

  // ========================================
  // Pagination
  // ========================================

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCourses: 0,
    limit: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ========================================
  // Fetch Categories
  // ========================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const res = await fetch("/api/categories?active=true");

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch categories.");
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Fetch Categories Error:", error);

      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  // ========================================
  // Fetch Courses
  // ========================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", page.toString());

      params.set("limit", "12");

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set("category", category);
      }

      if (level) {
        params.set("level", level);
      }

      if (price) {
        params.set("price", price);
      }

      if (sort) {
        params.set("sort", sort);
      }

      const res = await fetch(`/api/courses?${params.toString()}`);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch courses.");
      }

      setCourses(data.courses || []);

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalCourses: 0,
          limit: 12,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (error) {
      console.error("Fetch Courses Error:", error);

      setError(error.message || "Something went wrong while loading courses.");

      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Initial Data
  // ========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ========================================
  // Fetch Courses When Filters Change
  // ========================================

  useEffect(() => {
    fetchCourses();
  }, [search, category, level, price, sort, page]);

  // ========================================
  // Search Submit
  // ========================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    setSearch(searchInput.trim());
  };

  // ========================================
  // Clear Search
  // ========================================

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // ========================================
  // Clear All Filters
  // ========================================

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setLevel("");
    setPrice("");
    setSort("newest");
    setPage(1);
  };

  // ========================================
  // Filter Change
  // ========================================

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleLevelChange = (value) => {
    setLevel(value);
    setPage(1);
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  // ========================================
  // Format Price
  // ========================================

  const formatPrice = (price) => {
    if (!price || price <= 0) {
      return "Free";
    }

    return `৳${price.toLocaleString()}`;
  };

  // ========================================
  // Format Level
  // ========================================

  const formatLevel = (level) => {
    if (!level) {
      return "Beginner";
    }

    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // ========================================
  // Active Filter Check
  // ========================================

  const hasActiveFilters = search || category || level || price;

  // ========================================
  // Loading Skeleton
  // ========================================

  const CourseSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />

      <CardContent className="space-y-4 p-5">
        <Skeleton className="h-5 w-24" />

        <Skeleton className="h-6 w-full" />

        <Skeleton className="h-4 w-4/5" />

        <div className="flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />

          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  // ========================================
  // Render
  // ========================================

  return (
    <main className="min-h-screen bg-background">
      {/* ==================================== */}
      {/* HERO */}
      {/* ==================================== */}

      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              <FaGraduationCap className="mr-2" />
              LearnHub Courses
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Explore Courses
            </h1>

            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Learn practical skills from professional instructors and grow your
              career.
            </p>

            {/* Search */}

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-2xl gap-2"
            >
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search courses..."
                  className="h-12 w-full rounded-xl border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
                <FaSearch className="mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================================== */}
      {/* CONTENT */}
      {/* ==================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* ================================= */}
          {/* FILTER SIDEBAR */}
          {/* ================================= */}

          <aside>
            <Card className="sticky top-6">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-primary" />

                    <h2 className="font-semibold">Filters</h2>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="mt-6 space-y-7">
                  {/* Category */}

                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Category</h3>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange("")}
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          category === ""
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        All Categories
                      </button>

                      {categoryLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-9 w-full" />
                          <Skeleton className="h-9 w-full" />
                          <Skeleton className="h-9 w-full" />
                        </div>
                      ) : (
                        categories.map((item) => (
                          <button
                            key={item._id}
                            type="button"
                            onClick={() => handleCategoryChange(item.slug)}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                              category === item.slug
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            {item.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Level */}

                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Level</h3>

                    <div className="space-y-2">
                      {levels.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handleLevelChange(item.value)}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            level === item.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}

                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Price</h3>

                    <div className="space-y-2">
                      {priceOptions.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handlePriceChange(item.value)}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            price === item.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* ================================= */}
          {/* COURSES */}
          {/* ================================= */}

          <div>
            {/* Top Bar */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading courses..."
                    : `${pagination.totalCourses} courses found`}
                </p>

                {search && (
                  <p className="mt-1 text-sm">
                    Search results for{" "}
                    <span className="font-semibold">"{search}"</span>
                  </p>
                )}
              </div>

              {/* Sort */}

              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-muted-foreground sm:block">
                  Sort:
                </span>

                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}

            {error && !loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <FaBookOpen className="text-2xl" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    Unable to load courses
                  </h2>

                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    {error}
                  </p>

                  <Button className="mt-5" onClick={fetchCourses}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Loading */}

            {loading && !error && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <CourseSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Empty */}

            {!loading && !error && courses.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <FaBookOpen className="text-3xl text-muted-foreground" />
                  </div>

                  <h2 className="mt-6 text-xl font-semibold">
                    No courses found
                  </h2>

                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    We couldn't find any courses matching your current filters.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Course Grid */}

            {!loading && !error && courses.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <Card
                      key={course._id}
                      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Thumbnail */}

                      <Link href={`/courses/${course.slug}`}>
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FaBookOpen className="text-4xl text-muted-foreground" />
                            </div>
                          )}

                          {course.discountPrice > 0 &&
                            course.discountPrice < course.price && (
                              <Badge className="absolute left-3 top-3 border-0 bg-primary text-primary-foreground">
                                Sale
                              </Badge>
                            )}
                        </div>
                      </Link>

                      <CardContent className="p-5">
                        {/* Category */}

                        <div className="mb-3">
                          <Badge
                            variant="secondary"
                            className="max-w-full truncate"
                          >
                            {course.category?.name || "Uncategorized"}
                          </Badge>
                        </div>

                        {/* Title */}

                        <Link href={`/courses/${course.slug}`}>
                          <h2 className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 transition-colors group-hover:text-primary">
                            {course.title}
                          </h2>
                        </Link>

                        {/* Description */}

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                          {course.shortDescription || course.description}
                        </p>

                        {/* Instructor */}

                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                            {course.instructor?.avatar ? (
                              <Image
                                src={course.instructor.avatar}
                                alt={course.instructor.name || "Instructor"}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FaGraduationCap className="text-muted-foreground" />
                            )}
                          </div>

                          <span className="truncate text-sm text-muted-foreground">
                            {course.instructor?.name || "Instructor"}
                          </span>
                        </div>

                        {/* Stats */}

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />

                            {course.rating?.toFixed(1) || "0.0"}
                          </span>

                          <span className="flex items-center gap-1">
                            <FaUsers />

                            {course.totalStudents || 0}
                          </span>

                          <span className="flex items-center gap-1">
                            <FaClock />
                            {course.duration || 0}h
                          </span>

                          <span className="flex items-center gap-1">
                            <FaLayerGroup />

                            {formatLevel(course.level)}
                          </span>
                        </div>

                        {/* Bottom */}

                        <div className="mt-5 flex items-end justify-between gap-3 border-t pt-4">
                          <div>
                            {course.discountPrice > 0 &&
                            course.discountPrice < course.price ? (
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-xl font-bold">
                                  {formatPrice(course.discountPrice)}
                                </span>

                                <span className="text-xs text-muted-foreground line-through">
                                  {formatPrice(course.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold">
                                {formatPrice(course.price)}
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            nativeButton={false}
                            render={<Link href={`/courses/${course.slug}`} />}
                          >
                            View Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ================================= */}
                {/* PAGINATION */}
                {/* ================================= */}

                {pagination.totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!pagination.hasPreviousPage}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      aria-label="Previous page"
                    >
                      <FaChevronLeft />
                    </Button>

                    {Array.from(
                      {
                        length: pagination.totalPages,
                      },
                      (_, index) => index + 1,
                    )
                      .filter((pageNumber) => {
                        return (
                          pageNumber === 1 ||
                          pageNumber === pagination.totalPages ||
                          Math.abs(pageNumber - pagination.currentPage) <= 1
                        );
                      })
                      .map((pageNumber, index, array) => {
                        const previous = array[index - 1];

                        const showDots = previous && pageNumber - previous > 1;

                        return (
                          <div
                            key={pageNumber}
                            className="flex items-center gap-2"
                          >
                            {showDots && (
                              <span className="px-1 text-muted-foreground">
                                ...
                              </span>
                            )}

                            <Button
                              variant={
                                pagination.currentPage === pageNumber
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              onClick={() => setPage(pageNumber)}
                            >
                              {pageNumber}
                            </Button>
                          </div>
                        );
                      })}

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage((prev) => prev + 1)}
                      aria-label="Next page"
                    >
                      <FaChevronRight />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
