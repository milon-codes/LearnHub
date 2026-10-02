import {
  FaBullseye,
  FaChalkboardTeacher,
  FaChartLine,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";

const benefits = [
  {
    icon: FaBullseye,
    title: "Practical Learning",
    description:
      "Learn through practical lessons and real-world projects that help you apply your skills.",
  },
  {
    icon: FaChalkboardTeacher,
    title: "Expert Instructors",
    description:
      "Learn from instructors who bring practical knowledge and industry experience to every course.",
  },
  {
    icon: FaChartLine,
    title: "Track Your Progress",
    description:
      "Monitor your learning progress, completed lessons, quizzes, and achievements in one place.",
  },
  {
    icon: FaClock,
    title: "Learn at Your Pace",
    description:
      "Study whenever it works for you and continue learning from wherever you are.",
  },
];

export default function WhyLearnHub() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Why LearnHub
          </Badge>

          <h2 className="heading-2">Everything You Need to Keep Learning</h2>

          <p className="body-text mt-4">
            LearnHub brings quality courses, practical learning, and useful
            tools together to help you build skills with confidence.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <Card
                key={benefit.title}
                className="group relative overflow-hidden border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

                {/* Icon */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="text-xl" />
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="relative mt-6 flex items-center gap-2 text-xs font-medium text-primary">
                  <FaCheckCircle />
                  Built for learners
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-14 overflow-hidden rounded-3xl border bg-muted/30 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">
                Learn with purpose
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Turn your learning time into real progress.
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                Choose a course, follow your learning path, practice what you
                learn, and keep improving one step at a time.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-primary/10 text-primary lg:self-center">
              <FaArrowRight />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
