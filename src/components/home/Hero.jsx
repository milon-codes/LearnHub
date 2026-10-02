import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid min-h-[calc(100vh-80px)] items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-2 text-sm font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Learn skills. Build your future.
            </div>

            {/* Heading */}
            <h1 className="heading-1 max-w-3xl">
              Learn Today.
              <span className="block text-primary">Grow Tomorrow.</span>
            </h1>

            {/* Description */}
            <p className="body-text mt-6 max-w-xl text-lg">
              Learn practical skills from experienced instructors and build
              knowledge that helps you move forward in your career.
            </p>

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
                render={<Link href="/about" />}
              >
                <FaPlay className="mr-2 text-xs" />
                How LearnHub Works
              </Button>
            </div>

            {/* Trust Points */}
            <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-primary" />
                Expert instructors
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-primary" />
                Practical courses
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-primary" />
                Learn at your pace
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative mx-auto w-full max-w-xl">
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-3xl border bg-card p-4 shadow-2xl">
              {/* Fake Course Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl">
                    <FaPlay className="ml-1 text-2xl" />
                  </div>
                </div>

                <div className="absolute left-5 top-5 rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">
                  Featured Course
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-xl border bg-background/90 p-4 shadow-lg backdrop-blur">
                    <p className="text-xs font-medium text-muted-foreground">
                      Web Development
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Full-Stack Web Development
                    </h3>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[72%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Lessons</p>
                  <p className="mt-1 font-semibold">48+</p>
                </div>

                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="mt-1 font-semibold">2.5K+</p>
                </div>

                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="mt-1 font-semibold">4.9/5</p>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FaCheckCircle />
                </div>

                <div>
                  <p className="text-sm font-semibold">Learning Progress</p>
                  <p className="text-xs text-muted-foreground">
                    Keep going — you're doing great!
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -right-5 -top-5 hidden rounded-2xl border bg-card p-4 shadow-xl sm:block">
              <p className="text-xs text-muted-foreground">Active Learners</p>

              <p className="mt-1 text-xl font-bold">10K+</p>

              <p className="text-xs text-primary">Growing every day</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
