'use client';

import { useState, useEffect } from 'react';
import { catAPI } from './lib/api';
import { SpyCat } from './types';
import CatCard from './components/CatCard';
import CatCreateForm from './components/CatCreateForm';

export default function Home() {
  const [cats, setCats] = useState<SpyCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCats = async () => {
    try {
      const response = await catAPI.getAll();
      setCats(response.data);
      setError('');
    } catch (err: any) {
      setError(`Failed to fetch cats: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (data: Omit<SpyCat, 'id'>) => {
    setError('');
    try {
      await catAPI.create(data);
      await fetchCats();
    } catch (err: any) {
      if (err.response?.data) {
        const errors = err.response.data;
        const errorMsg = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        setError(`Validation error: ${errorMsg}`);
      } else {
        setError(`Failed to create cat: ${err.message}`);
      }
    }
  };

  const handleUpdate = async (id: number, salary: string) => {
    setError('');
    try {
      await catAPI.update(id, { salary });
      await fetchCats();
    } catch (err: any) {
      setError(`Failed to update cat: ${err.response?.data?.message || err.message}`);
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await catAPI.delete(id);
      await fetchCats();
    } catch (err: any) {
      setError(`Failed to delete cat: ${err.response?.data?.message || err.message}`);
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">🕵️ Spy Cat Agency</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <CatCreateForm onSubmit={handleCreate} />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Spy Cats ({cats.length})</h2>
            <div className="grid gap-4">
              {cats.map((cat) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}