import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaStar, FaUsers, FaClock } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";

const courses = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description:
      "Learn how to build modern full-stack web applications from frontend to backend.",
    category: "Web Development",
    instructor: "Milon Academy",
    image: "/images/courses/web-development.jpg",
    rating: 4.9,
    students: "2.5K",
    duration: "42h",
    price: "$49",
    oldPrice: "$79",
  },
  {
    id: 2,
    title: "Modern React Development",
    description:
      "Build scalable and interactive web applications using modern React concepts.",
    category: "Frontend",
    instructor: "Milon Academy",
    image: "/images/courses/react.jpg",
    rating: 4.8,
    students: "1.8K",
    duration: "28h",
    price: "$39",
    oldPrice: "$59",
  },
  {
    id: 3,
    title: "Next.js Full-Stack Development",
    description:
      "Build production-ready applications with Next.js, APIs, authentication and databases.",
    category: "Next.js",
    instructor: "Milon Academy",
    image: "/images/courses/nextjs.jpg",
    rating: 4.9,
    students: "1.2K",
    duration: "35h",
    price: "$59",
    oldPrice: "$89",
  },
];

function CourseCard({ course }) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Course Image */}
      <Link href={`/courses/${course.id}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category */}
          <div className="absolute left-4 top-4">
            <Badge className="border-0 bg-background/90 text-foreground shadow-sm backdrop-blur">
              {course.category}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold">{course.rating}</span>
          </div>

          <span className="text-sm text-muted-foreground">
            {course.students} students
          </span>
        </div>

        {/* Title */}
        <Link href={`/courses/${course.id}`}>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {course.description}
        </p>

        {/* Instructor */}
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          By <span className="text-foreground">{course.instructor}</span>
        </p>

        {/* Course Meta */}
        <div className="mt-4 flex items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FaClock />
            {course.duration}
          </div>

          <div className="flex items-center gap-1.5">
            <FaUsers />
            {course.students}
          </div>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{course.price}</span>

            <span className="text-sm text-muted-foreground line-through">
              {course.oldPrice}
            </span>
          </div>

          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/courses/${course.id}`} />}
          >
            View Course
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function PopularCourses() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              Learn Something New
            </Badge>

            <h2 className="heading-2">Popular Courses</h2>

            <p className="body-text mt-4 max-w-xl">
              Explore practical courses designed to help you build real-world
              skills and grow your career.
            </p>
          </div>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/courses" />}
          >
            View All Courses
            <FaArrowRight className="ml-2 text-xs" />
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}
