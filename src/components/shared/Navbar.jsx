"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  FaBookOpen,
  FaChevronDown,
  FaBars,
  FaXmark,
  FaCode,
  FaPalette,
  FaBriefcase,
  FaBullhorn,
  FaArrowRight,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import ThemeToggle from "./ThemeToggle";

const categories = [
  {
    name: "Web Development",
    description: "Build modern websites and apps",
    icon: FaCode,
  },
  {
    name: "Design",
    description: "UI/UX and creative design",
    icon: FaPalette,
  },
  {
    name: "Business",
    description: "Grow your business skills",
    icon: FaBriefcase,
  },
  {
    name: "Marketing",
    description: "Learn digital marketing",
    icon: FaBullhorn,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  const closeMobile = () => {
    setMobileOpen(false);
    setCategoryOpen(false);
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      {" "}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}{" "}
        <Link
          href="/"
          onClick={closeMobile}
          className="group flex items-center gap-2.5"
        >
          {" "}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
            {" "}
            <FaBookOpen className="text-lg" />{" "}
          </div>
          <div className="flex flex-col">
            <span className="text-[19px] font-bold leading-none tracking-tight text-foreground">
              Learn<span className="text-primary">Hub</span>
            </span>

            <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Learn. Grow. Succeed.
            </span>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/" label="Home" />
          <NavLink href="/courses" label="Courses" />

          {/* Categories */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              aria-expanded={categoryOpen}
            >
              Categories
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoryOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-[360px] -translate-x-1/2 rounded-2xl border border-border bg-background p-2 shadow-2xl shadow-black/10 dark:shadow-black/30">
                <div className="mb-1 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Explore Categories
                  </p>
                </div>

                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      key={category.name}
                      href={`/categories/${category.name}`}
                      onClick={() => setCategoryOpen(false)}
                      className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}

                <Link
                  href="/categories"
                  onClick={() => setCategoryOpen(false)}
                  className="mt-1 flex items-center justify-between rounded-xl border-t border-border px-3 py-3 text-sm font-semibold text-primary"
                >
                  View all categories
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            )}
          </div>

          <NavLink href="/instructors" label="Instructors" />
        </nav>
        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          ) : isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <FaUserCircle />
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FaBars /> : <FaBars />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-1">
              <MobileLink href="/" label="Home" onClick={closeMobile} />

              <MobileLink
                href="/courses"
                label="Courses"
                onClick={closeMobile}
              />

              {/* Mobile Categories */}
              <button
                type="button"
                onClick={() => setCategoryOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <span>Categories</span>

                <FaChevronDown
                  className={`text-xs transition-transform ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoryOpen && (
                <div className="ml-3 border-l border-border pl-3">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href="/courses"
                      onClick={closeMobile}
                      className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              <MobileLink
                href="/instructors"
                label="Instructors"
                onClick={closeMobile}
              />
            </nav>

            {/* Mobile Actions */}
            <div className="mt-4 border-t border-border pt-4">
              {status === "loading" ? (
                <div className="h-11 animate-pulse rounded-xl bg-muted" />
              ) : isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    <FaUserCircle />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="rounded-xl px-3 py-3 text-center text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="rounded-xl bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
    >
      {label}{" "}
    </Link>
  );
}

function MobileLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {label}{" "}
    </Link>
  );
}
