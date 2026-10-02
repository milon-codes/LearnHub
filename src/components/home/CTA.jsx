import Link from "next/link";
import {
  FaArrowRight,
  FaBookOpen,
  FaCheckCircle,
  FaPlay,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

const benefits = [
  "Learn practical skills",
  "Track your progress",
  "Learn from expert instructors",
];

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="overflow-hidden rounded-3xl border bg-muted/30">
          <div className="grid items-center gap-10 p-8 sm:p-10 lg:grid-cols-[1.4fr_0.6fr] lg:p-14">
            {/* Content */}
            <div>
              <Badge variant="secondary" className="mb-5">
                Start Learning Today
              </Badge>

              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to build skills that move you forward?
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Explore practical courses, learn from experienced instructors,
                and take the next step in your learning journey with LearnHub.
              </p>

              {/* Benefits */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <FaCheckCircle className="shrink-0 text-primary" />
                    {benefit}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/courses" />}
                >
                  Explore Courses
                  <FaArrowRight className="ml-2 text-sm" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/register" />}
                >
                  <FaPlay className="mr-2 text-xs" />
                  Get Started
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative rounded-3xl border bg-card p-6 shadow-xl">
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FaBookOpen className="text-2xl" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Your learning journey starts here.
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Choose a course, start learning, and keep making progress
                  every day.
                </p>

                {/* Progress */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Learning Progress
                    </span>

                    <span className="font-semibold">75%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/4 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xl font-bold">10K+</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Learners
                    </p>
                  </div>

                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xl font-bold">100+</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Courses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
