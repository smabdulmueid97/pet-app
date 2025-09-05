// File: src/app/reset-password/page.tsx

import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import ResetPasswordForm from "@/components/ResetPasswordForm";

// A simple loading component to show while the form is loading on the client
function Loading() {
  return <div className="text-center">Loading...</div>;
}

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-sm p-6 space-y-4 text-center">
        <img
          src="/images/logo.png"
          alt="Pet Grooming Logo"
          width="240"
          height="80"
          className="mx-auto"
        />

        {/* Wrap the form in a Suspense boundary */}
        <Suspense fallback={<Loading />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
