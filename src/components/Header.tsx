// File: src/components/Header.tsx

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="app-header">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="TEST Logo" className="w-24 h-auto" />
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden space-x-4 md:flex">
            <Link
              href="#"
              className="font-medium hover:text-white dark:hover:text-amber-400"
            >
              Services
            </Link>
            <Link
              href="#"
              className="font-medium hover:text-white dark:hover:text-amber-400"
            >
              About
            </Link>
            <Link
              href="#"
              className="font-medium hover:text-white dark:hover:text-amber-400"
            >
              Contact
            </Link>
          </nav>

          <div className="w-px h-6 bg-amber-300 dark:bg-gray-700"></div>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            {isLoading ? (
              <div className="w-24 h-8 rounded-md bg-white/20 animate-pulse"></div>
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <span className="font-semibold">{session.user?.name}</span>
                </button>
                <div
                  className={`${
                    isDropdownOpen ? "block" : "hidden"
                  } absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800`}
                >
                  <div className="py-1">
                    <Link
                      href={
                        session.user.role === "customer"
                          ? "/dashboard"
                          : "/admin/dashboard"
                      }
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 font-semibold text-gray-800 bg-white rounded-md shadow-sm hover:bg-gray-200 dark:text-gray-800 dark:bg-amber-400 dark:hover:bg-amber-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
