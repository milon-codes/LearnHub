import Link from "next/link";
import {
  FaArrowRight,
  FaCode,
  FaPalette,
  FaChartLine,
  FaMobileAlt,
  FaDatabase,
  FaBullhorn,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";

const categories = [
  {
    id: 1,
    name: "Web Development",
    description: "Build modern websites and full-stack applications.",
    courses: 24,
    icon: FaCode,
  },
  {
    id: 2,
    name: "UI/UX Design",
    description: "Design beautiful and user-friendly digital experiences.",
    courses: 18,
    icon: FaPalette,
  },
  {
    id: 3,
    name: "Business",
    description: "Develop practical skills for business and entrepreneurship.",
    courses: 16,
    icon: FaChartLine,
  },
  {
    id: 4,
    name: "Mobile Development",
    description: "Create modern mobile applications for real users.",
    courses: 14,
    icon: FaMobileAlt,
  },
  {
    id: 5,
    name: "Database",
    description: "Learn databases, data modeling and backend technologies.",
    courses: 12,
    icon: FaDatabase,
  },
  {
    id: 6,
    name: "Digital Marketing",
    description: "Learn strategies to grow brands and online businesses.",
    courses: 20,
    icon: FaBullhorn,
  },
];

export default function Categories() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Explore Learning
          </Badge>

          <h2 className="heading-2">Explore Our Categories</h2>

          <p className="body-text mt-4">
            Find the right category, discover valuable courses, and start
            building skills that matter.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group"
              >
                <Card className="h-full border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                  {/* Icon */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="text-xl" />
                    </div>

                    <FaArrowRight className="mt-2 text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                  </div>

                  {/* Course Count */}
                  <div className="mt-5 border-t pt-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {category.courses} Courses
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Browse all courses
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
