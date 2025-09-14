// File: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import Header from "@/components/Header"; // Import Header
import Footer from "@/components/Footer"; // Import Footer
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pet Grooming App",
  description: "Manage your pet grooming appointments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard"); // ADDED

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {isAdminPage || isDashboardPage ? ( // UPDATED
              <>{children}</>
            ) : (
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            )}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
