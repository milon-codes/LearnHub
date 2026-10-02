import { auth } from "@/auth";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Welcome, {session.user.name} 👋</h1>
      

      <nav className="m-10">
        <ul>
         {
          session.user.role == 'admin' &&  <li><Link href={'/admin/dashboard'} className="border border-amber-400 px-4 py-1 m-10 rounded">Admin Panel </Link></li>
         }
         {
          session.user.role == 'instructor' &&  <li><Link href={'/instructor/dashboard'} className="border border-amber-400 px-4 py-1 m-10 rounded">Instructor Dashboard </Link></li>
         }
        </ul>
      </nav>

      <div className="mt-6 space-y-2 rounded-lg border p-6">
        <p>
          <strong>Name:</strong> {session.user.name}
        </p>

        <p>
          <strong>Email:</strong> {session.user.email}
        </p>

        <p>
          <strong>Role:</strong> {session.user.role}
        </p>

        <LogoutButton />
      </div>
    </main>
  );
}
