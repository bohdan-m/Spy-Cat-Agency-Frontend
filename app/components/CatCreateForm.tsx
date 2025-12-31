'use client';

import { useState, useEffect } from 'react';
import { SpyCat } from '../types';

interface CatFormProps {
  onSubmit: (data: Omit<SpyCat, 'id'>) => Promise<void>;
  initialData?: SpyCat;
  isEdit?: boolean;
}

export default function CatCreateForm({ onSubmit, initialData, isEdit = false }: CatFormProps) {
  const [formData, setFormData] = useState<Omit<SpyCat, 'id'>>({
    name: '',
    breed: '',
    years_of_experience: 0,
    salary: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        breed: initialData.breed || '',
        years_of_experience: initialData.years_of_experience || 0,
        salary: initialData.salary || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (formData.name.length > 100) {
      setFormError('Name must be less than 100 characters');
      return;
    }
    
    if (formData.breed.length > 100) {
      setFormError('Breed must be less than 100 characters');
      return;
    }
    
    if (formData.salary.length > 12) {
      setFormError('Salary value is too large');
      return;
    }

    const salaryNumber = parseFloat(formData.salary);
    if (isNaN(salaryNumber)) {
      setFormError('Please enter a valid salary number');
      return;
    }
    
    const salaryParts = formData.salary.split('.');
    const integerPart = salaryParts[0].replace(/\D/g, '');
    if (integerPart.length > 8) {
      setFormError('Salary cannot exceed 8 digits before decimal point');
      return;
    }

    if (salaryParts[1] && salaryParts[1].length > 2) {
      setFormError('Salary can have maximum 2 decimal places');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!isEdit) {
        setFormData({
          name: '',
          breed: '',
          years_of_experience: 0,
          salary: '',
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    setFormData({ ...formData, years_of_experience: numericValue });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/[^\d.]/g, '');
    
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    const decimalParts = value.split('.');
    if (decimalParts[1] && decimalParts[1].length > 2) {
      value = decimalParts[0] + '.' + decimalParts[1].slice(0, 2);
    }
    
    const integerPart = decimalParts[0].replace(/\D/g, '');
    if (integerPart.length > 8) {
      return;
    }
    
    if (value.length <= 12) {
      setFormData({ ...formData, salary: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? 'Edit Cat' : 'Add New Spy Cat'}
      </h2>
      
      {formError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formError}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={100}
            placeholder="Enter cat name"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.name.length}/100 characters
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Breed</label>
          <input
            type="text"
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value.slice(0, 100) })}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={100}
            placeholder="Enter cat breed"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.breed.length}/100 characters
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Years of Experience</label>
          <input
            type="number"
            min="0"
            value={formData.years_of_experience}
            onChange={handleNumberChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            placeholder="Enter years of experience"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Salary ($)</label>
          <input
            type="text"
            value={formData.salary}
            onChange={handleSalaryChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={12}
            placeholder="Enter salary (e.g., 12345.67)"
          />
          <div className="text-xs text-gray-500 mt-1">
            Max 8 digits before decimal, 2 after (e.g., 12345678.99)
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Cat' : 'Add Cat')}
        </button>
      </div>
    </form>
  );
}