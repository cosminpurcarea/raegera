"use client"

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// Update the type to match your actual database schema
type GermanNoun = {
  id: number;
  word: string;
  article: 'der' | 'die' | 'das';
  translation: string;
  example?: string;
  example_translation?: string;
  category_id?: number;
  difficulty?: string;
  created_at?: string;
};

export default function Repository() {
  const [nouns, setNouns] = useState<GermanNoun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Extract fetchNouns as a useCallback so it's accessible throughout the component
  const fetchNouns = useCallback(async () => {
    setLoading(true);
    try {
      // Add search parameter if present
      let url = '/api/nouns';
      const params = new URLSearchParams();
      
      if (filter) {
        params.append('filter', filter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setNouns(data || []);
    } catch (error) {
      console.error('Error fetching nouns:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]); // Dependencies

  // Use the extracted function in useEffect
  useEffect(() => {
    fetchNouns();
  }, [fetchNouns]);

  // Remove client-side filtering since we're doing it server-side now
  const filteredNouns = nouns;
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredNouns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNouns = filteredNouns.slice(startIndex, startIndex + itemsPerPage);
  
  // Article color styles
  const articleColors = {
    der: 'text-blue-600 border-blue-200 bg-blue-50',
    die: 'text-pink-600 border-pink-200 bg-pink-50',
    das: 'text-green-600 border-green-200 bg-green-50',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">German Nouns Repository</h1>
          <p className="text-slate-600">
            Browse our comprehensive database of German nouns with their articles and translations.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-end">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search by German word or translation..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    fetchNouns();
                  }
                }}
              />
            </div>
            
            {/* Article Filter */}
            <div className="w-full md:w-64">
              <label htmlFor="filter" className="block text-sm font-medium text-slate-700 mb-1">Filter by Article</label>
              <select
                id="filter"
                className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <option value="">All Articles</option>
                <option value="der">der (masculine)</option>
                <option value="die">die (feminine)</option>
                <option value="das">das (neuter)</option>
              </select>
            </div>
            
            {/* Search Button - with proper alignment and spacing */}
            <div className="md:ml-4">
              <button
                className="w-full md:w-auto px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                onClick={fetchNouns}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Nouns Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-slate-600">Loading nouns...</p>
            </div>
          ) : paginatedNouns.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              {searchTerm || filter ? "No nouns match your search criteria." : "No nouns available."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-700 text-sm">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Article</th>
                    <th className="py-3 px-4 text-left font-semibold">German Noun</th>
                    <th className="py-3 px-4 text-left font-semibold">English Translation</th>
                    <th className="py-3 px-4 text-left font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedNouns.map((noun) => (
                    <tr key={noun.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 align-top">
                        <span className={`inline-block px-2 py-1 rounded-md border text-sm font-medium ${articleColors[noun.article]}`}>
                          {noun.article}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 align-top">{noun.word}</td>
                      <td className="py-3 px-4 text-slate-600 align-top">{noun.translation}</td>
                      <td className="py-3 px-4 align-top">
                        {noun.example && (
                          <div>
                            <p className="text-slate-800 mb-1">{noun.example}</p>
                            {noun.example_translation && (
                              <p className="text-slate-500 text-sm italic">{noun.example_translation}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && filteredNouns.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredNouns.length)} of {filteredNouns.length} nouns
            </p>
            <div className="flex space-x-1">
              <button
                className="px-3 py-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-8 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} RAEGERA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 