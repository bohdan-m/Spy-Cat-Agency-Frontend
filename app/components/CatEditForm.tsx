'use client';

import { useState, useEffect } from 'react';
import { SpyCat } from '../types';

interface CatFormProps {
  onSubmit: (data: { salary: string }) => Promise<void>;
  initialSalary?: string;
}

export default function CatEditForm({ onSubmit, initialSalary = '' }: CatFormProps) {
  const [salary, setSalary] = useState(initialSalary);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setSalary(initialSalary);
  }, [initialSalary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (salary.length > 12) {
      setFormError('Salary value is too large');
      return;
    }

    const salaryNumber = parseFloat(salary);
    if (isNaN(salaryNumber)) {
      setFormError('Please enter a valid salary number');
      return;
    }
    
    const salaryParts = salary.split('.');
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
      await onSubmit({ salary });
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
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
      setSalary(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Salary</h2>
      
      {formError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formError}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Salary ($)</label>
          <input
            type="text"
            value={salary}
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
          {loading ? 'Saving...' : 'Update Salary'}
        </button>
      </div>
    </form>
  );
}