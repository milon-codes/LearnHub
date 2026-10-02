import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaStar, FaUsers, FaBookOpen } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

const instructors = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Full-Stack Web Developer",
    image: "/images/instructors/sarah.jpg",
    rating: 4.9,
    students: "2.5K",
    courses: 12,
  },
  {
    id: 2,
    name: "James Wilson",
    role: "UI/UX Design Instructor",
    image: "/images/instructors/james.jpg",
    rating: 4.8,
    students: "1.8K",
    courses: 9,
  },
  {
    id: 3,
    name: "David Miller",
    role: "JavaScript & React Instructor",
    image: "/images/instructors/david.jpg",
    rating: 4.9,
    students: "3.2K",
    courses: 15,
  },
  {
    id: 4,
    name: "Emily Carter",
    role: "Digital Marketing Expert",
    image: "/images/instructors/emily.jpg",
    rating: 4.8,
    students: "2.1K",
    courses: 8,
  },
];

function InstructorCard({ instructor }) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <Link href={`/instructors/${instructor.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={instructor.image}
            alt={instructor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Rating */}
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border bg-background/90 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            <FaStar className="text-yellow-500" />
            {instructor.rating}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/instructors/${instructor.id}`}>
          <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {instructor.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {instructor.role}
        </p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaUsers className="text-sm" />
            </div>

            <div>
              <p className="text-sm font-semibold">{instructor.students}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaBookOpen className="text-sm" />
            </div>

            <div>
              <p className="text-sm font-semibold">{instructor.courses}</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function TopInstructors() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              Learn From Experts
            </Badge>

            <h2 className="heading-2">Top Instructors</h2>

            <p className="body-text mt-4 max-w-xl">
              Learn from experienced instructors who share practical knowledge
              and help you build valuable skills.
            </p>
          </div>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/instructors" />}
          >
            View All Instructors
            <FaArrowRight className="ml-2 text-xs" />
          </Button>
        </div>

        {/* Instructors Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </Container>
    </section>
  );
}
