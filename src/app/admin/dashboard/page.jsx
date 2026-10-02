import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const { authorized, session } = await requireRole(["admin"]);

  if (!session) {
    redirect("/login");
  }

  if (!authorized) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard ⚙️</h1>

      <Link href={"/admin/courses"} className="text-blue-700 p-2.5 border">
        Course
      </Link>

      <p className="mt-3 text-muted-foreground">Welcome, {session.user.name}</p>

      <div className="mt-8 rounded-lg border p-6">
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>

        <p className="mt-2">
          <strong>Role:</strong> {session.user.role}
        </p>
      </div>
    </main>
  );
}
