import { auth } from "@/auth";

export async function requireRole(allowedRoles = []) {
  const session = await auth();

  if (!session) {
    return {
      authorized: false,
      session: null,
    };
  }

  const userRole = session.user?.role;

  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      session,
    };
  }

  return {
    authorized: true,
    session,
  };
}
