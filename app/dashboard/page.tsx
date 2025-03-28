"use client"

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Script from 'next/script';
import { Dialog, Transition } from '@headlessui/react';

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

type SessionDetail = {
  id: number;
  sessionId: number;
  nounId: number;
  word: string;
  article: 'der' | 'die' | 'das';
  translation: string;
  userAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [chartScriptLoaded, setChartScriptLoaded] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetail[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  
  const sessionsChartRef = useRef<HTMLCanvasElement>(null);
  const accuracyChartRef = useRef<HTMLCanvasElement>(null);
  const sessionsChartInstance = useRef<any>(null);
  const accuracyChartInstance = useRef<any>(null);

  // Add this state to track when charts are ready to be rendered
  const [chartsReady, setChartsReady] = useState(false);

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

  // Update script loading approach for better reliability
  useEffect(() => {
    // Only run this once on mount
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Chart.js script loaded successfully');
      setChartScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Error loading Chart.js script:', error);
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Add a new useEffect to prepare charts when data and script are ready
  useEffect(() => {
    if (chartScriptLoaded && dailyStats.length > 0) {
      console.log('Data and script ready, preparing to render charts');
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        setChartsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [chartScriptLoaded, dailyStats]);

  // Replace the chart initialization useEffect with this improved version
  useEffect(() => {
    // Only run if everything is ready
    if (!chartsReady || typeof window === 'undefined' || !window.Chart) {
      return;
    }
    
    console.log('Rendering charts now');
    
    // Function to safely destroy existing chart instances
    const destroyCharts = () => {
      if (sessionsChartInstance.current) {
        sessionsChartInstance.current.destroy();
        sessionsChartInstance.current = null;
      }
      
      if (accuracyChartInstance.current) {
        accuracyChartInstance.current.destroy();
        accuracyChartInstance.current = null;
      }
    };
    
    // Function to initialize both charts with retry mechanism
    const initializeCharts = () => {
      try {
        // First destroy any existing charts
        destroyCharts();
        
        // Check if canvas elements exist and have dimensions
        if (!sessionsChartRef.current || !accuracyChartRef.current) {
          console.error('Chart canvas elements not found');
          return false;
        }
        
        const sessionsRect = sessionsChartRef.current.getBoundingClientRect();
        const accuracyRect = accuracyChartRef.current.getBoundingClientRect();
        
        // Check if canvas elements have dimensions
        if (sessionsRect.width === 0 || sessionsRect.height === 0 || 
            accuracyRect.width === 0 || accuracyRect.height === 0) {
          console.warn('Chart canvas elements have zero dimensions, will retry');
          return false;
        }
        
        console.log('Canvas dimensions verified, creating charts');
        
        // Sessions chart
        const sessionsCtx = sessionsChartRef.current.getContext('2d');
        if (sessionsCtx) {
          sessionsChartInstance.current = new window.Chart(sessionsCtx, {
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
        
        // Accuracy chart
        const accuracyCtx = accuracyChartRef.current.getContext('2d');
        if (accuracyCtx) {
          accuracyChartInstance.current = new window.Chart(accuracyCtx, {
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
        
        return true;
      } catch (error) {
        console.error('Error rendering charts:', error);
        return false;
      }
    };
    
    // Try to initialize charts
    const success = initializeCharts();
    
    // If not successful, retry after a brief delay (charts might need time to be visible in DOM)
    if (!success) {
      const retryTimer = setTimeout(() => {
        console.log('Retrying chart initialization');
        initializeCharts();
      }, 500);
      
      return () => {
        clearTimeout(retryTimer);
        destroyCharts();
      };
    }
    
    // Cleanup function
    return destroyCharts;
  }, [chartsReady, dailyStats]);

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

  // Update the fetchSessionDetails function with better error handling
  const fetchSessionDetails = async (sessionId: number) => {
    setIsDetailsLoading(true);
    try {
      console.log(`Fetching details for session ID: ${sessionId}`);
      const response = await fetch(`/api/sessions/${sessionId}/details`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch session details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Session details received:', data);
      setSessionDetails(data);
    } catch (error) {
      console.error('Error fetching session details:', error);
      // Show an error message to the user
      setError(`Failed to load session details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Add this function to open the details modal
  const openSessionDetails = (session: SessionData) => {
    setSelectedSession(session);
    setIsDetailsModalOpen(true);
    fetchSessionDetails(session.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Load Chart.js from CDN */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js" 
        onLoad={() => {
          console.log('Chart.js script loaded');
          setChartScriptLoaded(true);
        }}
        onError={() => console.error('Failed to load Chart.js')}
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
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sessions Per Day</h3>
                  <div className="h-64"> {/* Explicit height */}
                    <canvas ref={sessionsChartRef}></canvas>
                  </div>
                </div>
                
                {/* Accuracy Per Day Chart */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Average Accuracy Per Day</h3>
                  <div className="h-64"> {/* Explicit height */}
                    <canvas ref={accuracyChartRef}></canvas>
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
                                onClick={() => openSessionDetails(session)}
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

      <Transition.Root show={isDetailsModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsDetailsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={() => setIsDetailsModalOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <span className="h-6 w-6 flex items-center justify-center">×</span>
                    </button>
                  </div>
                  
                  {selectedSession && (
                    <div>
                      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                        Session Details - {formatDate(selectedSession.date)}
                      </Dialog.Title>
                      
                      {/* Session summary */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Score</p>
                            <p className="text-lg font-medium">{selectedSession.score}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Words</p>
                            <p className="text-lg font-medium">{selectedSession.totalNouns}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Time</p>
                            <p className="text-lg font-medium">{formatTime(selectedSession.totalTime)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Avg. Time per Word</p>
                            <p className="text-lg font-medium">{selectedSession.secondsPerNoun}s</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Session details table */}
                      {isDetailsLoading ? (
                        <div className="flex justify-center py-12">
                          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                        </div>
                      ) : sessionDetails.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Word</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Translation</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Correct Article</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Your Answer</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Result</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {sessionDetails.map((detail) => (
                                <tr key={detail.id} className={detail.isCorrect ? "bg-green-50" : "bg-red-50"}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{detail.word}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.translation}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.article}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.userAnswer || 'skipped'}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                      detail.isCorrect 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {detail.isCorrect ? "Correct" : "Incorrect"}
                                    </span>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.timeSpent}s</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-red-50 text-red-600 p-6 rounded-lg">
                          Unable to load session details. Please try again later.
                        </div>
                      )}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
} 