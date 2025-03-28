"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Script from 'next/script';

// Define types
type SessionData = {
  id: number;
  date: string;
  score: number;
  totalNouns: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  secondsPerNoun: number;
  totalTime: number;
};

type DailyStats = {
  date: string;
  formattedDate: string;
  sessionsCount: number;
  averageScore: number;
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [chartScriptLoaded, setChartScriptLoaded] = useState(false);
  
  const sessionsChartRef = useRef<HTMLCanvasElement>(null);
  const accuracyChartRef = useRef<HTMLCanvasElement>(null);

  // Fetch user's session data
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/sessions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      
      const data = await response.json();
      setSessions(data);
      
      // Process data for stats
      const stats = processDailyStats(data);
      setDailyStats(stats);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load your session data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Process sessions into daily statistics
  const processDailyStats = (sessions: SessionData[]) => {
    // Group sessions by date
    const groupedByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.date).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          sessions: [],
          totalScore: 0
        };
      }
      
      acc[date].sessions.push(session);
      acc[date].totalScore += session.score;
      
      return acc;
    }, {} as Record<string, { sessions: SessionData[], totalScore: number }>);
    
    // Convert to array of daily stats
    const stats = Object.entries(groupedByDate).map(([date, data]) => {
      const { sessions, totalScore } = data;
      
      // Format date for display (e.g., "Jan 15")
      const d = new Date(date);
      const formattedDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
      
      return {
        date,
        formattedDate,
        sessionsCount: sessions.length,
        averageScore: Math.round(totalScore / sessions.length)
      };
    });
    
    // Sort by date ascending
    return stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Calculate overall statistics
  const calculateStats = () => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        totalNouns: 0,
        totalTime: 0
      };
    }
    
    const totalSessions = sessions.length;
    const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
    const totalNouns = sessions.reduce((sum, session) => sum + session.totalNouns, 0);
    const totalTime = sessions.reduce((sum, session) => sum + session.totalTime, 0);
    
    return {
      totalSessions,
      averageScore: Math.round(totalScore / totalSessions),
      totalNouns,
      totalTime
    };
  };

  // Initialize charts once script is loaded and data is available
  useEffect(() => {
    if (!chartScriptLoaded || !dailyStats.length || !window.Chart) return;
    
    // Render sessions chart
    if (sessionsChartRef.current) {
      const sessionsCtx = sessionsChartRef.current.getContext('2d');
      if (sessionsCtx) {
        new window.Chart(sessionsCtx, {
          type: 'bar',
          data: {
            labels: dailyStats.map(stat => stat.formattedDate),
            datasets: [{
              label: 'Sessions',
              data: dailyStats.map(stat => stat.sessionsCount),
              backgroundColor: 'rgba(79, 70, 229, 0.3)',
              borderColor: 'rgb(79, 70, 229)',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { precision: 0 }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }
    
    // Render accuracy chart
    if (accuracyChartRef.current) {
      const accuracyCtx = accuracyChartRef.current.getContext('2d');
      if (accuracyCtx) {
        new window.Chart(accuracyCtx, {
          type: 'line',
          data: {
            labels: dailyStats.map(stat => stat.formattedDate),
            datasets: [{
              label: 'Accuracy (%)',
              data: dailyStats.map(stat => stat.averageScore),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.2,
              fill: true,
              pointBackgroundColor: 'rgb(16, 185, 129)',
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`
                }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                }
              }
            }
          }
        });
      }
    }
  }, [chartScriptLoaded, dailyStats]);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date (ISO to readable format)
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Handle script load event
  const handleChartScriptLoad = () => {
    setChartScriptLoaded(true);
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Load Chart.js from CDN */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/chart.js" 
        onLoad={handleChartScriptLoad}
        strategy="afterInteractive"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Your Dashboard</h1>
            
            <Link 
              href="/practice" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              New Practice Session
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Sessions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-2">Total Sessions</h2>
                  <p className="text-4xl font-bold text-gray-800">{stats.totalSessions}</p>
                  <p className="text-gray-600 mt-2">Completed practice sessions</p>
                </div>
                
                {/* Average Score */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-2">Average Score</h2>
                  <p className="text-4xl font-bold text-gray-800">{stats.averageScore}%</p>
                  <p className="text-gray-600 mt-2">Across all your sessions</p>
                </div>
                
                {/* Total Words Practiced */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-2">Words Practiced</h2>
                  <p className="text-4xl font-bold text-gray-800">{stats.totalNouns}</p>
                  <p className="text-gray-600 mt-2">Total nouns reviewed</p>
                </div>
              </div>
              
              {/* Progress Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Sessions Per Day Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Sessions Per Day</h2>
                  <div className="h-64">
                    {sessions.length > 0 ? (
                      <canvas ref={sessionsChartRef}></canvas>
                    ) : (
                      <p className="text-gray-600 text-center py-12">No session data available yet</p>
                    )}
                  </div>
                </div>
                
                {/* Accuracy Per Day Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Accuracy Per Day</h2>
                  <div className="h-64">
                    {sessions.length > 0 ? (
                      <canvas ref={accuracyChartRef}></canvas>
                    ) : (
                      <p className="text-gray-600 text-center py-12">No session data available yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Session History Table */}
              <div className="bg-white rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Session History</h2>
                
                {sessions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nouns</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sessions.map((session) => (
                          <tr key={session.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(session.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.score}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.totalNouns}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(session.totalTime)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.secondsPerNoun}s</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => {/* Show session details */}}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-12">No sessions completed yet. Start practicing to see your history!</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 