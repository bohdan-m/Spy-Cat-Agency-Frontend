'use client';

import { useState } from 'react';
import { SpyCat } from '../types';
import CatEditForm from './CatEditForm';

interface CatCardProps {
  cat: SpyCat;
  onUpdate: (id: number, salary: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CatCard({ cat, onUpdate, onDelete }: CatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (data: { salary: string }) => {
    await onUpdate(cat.id!, data.salary);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(cat.id!);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <CatEditForm onSubmit={handleUpdate} initialSalary={cat.salary} />
        <button
          onClick={() => setIsEditing(false)}
          className="mt-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-semibold">Breed:</span> {cat.breed}</p>
        <p><span className="font-semibold">Experience:</span> {cat.years_of_experience} years</p>
        <p><span className="font-semibold">Salary:</span> ${cat.salary}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit Salary
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}