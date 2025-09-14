// File: src/app/dashboard/profile/page.tsx

"use client";

import { useSession } from "next-auth/react";
import ProfileForm from "@/components/ProfileForm";
import PetForm from "@/components/PetForm";
import PetList from "@/components/PetList";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-semibold">Your Information</h2>
          <ProfileForm user={session?.user} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Your Pets</h2>
          <PetForm />
          <PetList pets={session?.user?.pets} />
        </div>
      </div>
    </div>
  );
}
