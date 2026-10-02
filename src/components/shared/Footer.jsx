import Link from "next/link";
import { BookOpen, Mail, ArrowRight } from "lucide-react";

import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const platformLinks = [
  { name: "Courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "Instructors", href: "/instructors" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const resourceLinks = [
  { name: "Help Center", href: "/contact" },
  { name: "Become an Instructor", href: "/instructor/profile" },
  { name: "My Dashboard", href: "/dashboard" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: FaFacebook,
  },
  {
    name: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: FaLinkedin,
  },
  {
    name: "GitHub",
    href: "#",
    icon: FaGithub,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 sm:px-10 lg:px-12">
            {/* Background Decoration */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
                  Stay Updated
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                  Keep learning. Keep growing.
                </h2>

                <p className="mt-3 text-sm leading-6 text-primary-foreground/75 sm:text-base">
                  Get the latest courses, learning resources, and updates
                  delivered to your inbox.
                </p>
              </div>

              <div className="w-full max-w-md">
                <form className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 w-full rounded-xl border-0 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary transition-all hover:bg-white/90"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Learn<span className="text-primary">Hub</span>
                </span>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Learn. Grow. Succeed.
                </p>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Learn practical skills from expert instructors and build the
              knowledge you need to move forward in your career.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Platform */}
          <FooterColumn title="Platform" links={platformLinks} />

          {/* Company */}
          <FooterColumn title="Company" links={companyLinks} />

          {/* Resources */}
          <FooterColumn title="Resources" links={resourceLinks} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-center text-xs text-muted-foreground md:text-left">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-5">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
