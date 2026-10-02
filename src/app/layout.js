import "./globals.css";
import { Inter } from "next/font/google";

import ThemeProvider from "@/components/providers/ThemeProvider";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "LearnHub — Learn. Grow. Succeed.",
  description:
    "LearnHub is a modern online learning platform for students and instructors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthSessionProvider>
            <Navbar />

            <main>{children}</main>

            <Footer />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
