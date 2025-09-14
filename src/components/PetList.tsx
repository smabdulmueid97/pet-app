// File: src/components/PetList.tsx

"use client";

import { useRouter } from "next/navigation";

interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
}

export default function PetList({ pets }: { pets?: Pet[] }) {
  const router = useRouter();

  const handleDelete = async (petId: string) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      const res = await fetch(`/api/pets/${petId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete pet.");
      }
    }
  };

  if (!pets || pets.length === 0) {
    return (
      <p className="mt-8 text-center text-gray-500">
        You have no pets added yet.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Mobile View: Card List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 md:hidden">
          {pets.map((pet) => (
            <div key={pet._id} className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Name:</span>
                <span>{pet.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Breed:</span>
                <span className="truncate">{pet.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Age:</span>
                <span>{pet.age}</span>
              </div>
              <button
                onClick={() => handleDelete(pet._id)}
                className="w-full px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Breed
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Age
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {pets.map((pet) => (
                <tr key={pet._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{pet.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pet.breed}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pet.age}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(pet._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
