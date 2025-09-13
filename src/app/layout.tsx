// File: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import Header from "@/components/Header"; // Import Header
import Footer from "@/components/Footer"; // Import Footer
import { headers } from "next/headers";

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
  const heads = headers();
  const pathname = heads.get("next-url") || "";
  const isAdminPage = pathname.startsWith("/admin");

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
            {isAdminPage ? (
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
