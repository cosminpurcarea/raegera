"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Define noun type
type GermanNoun = {
  id: number;
  word: string;
  article: 'der' | 'die' | 'das';
  translation: string;
  example?: string;
  example_translation?: string;
};

// Session states
type SessionState = 'settings' | 'practicing' | 'results';

export default function Practice() {
  const router = useRouter();
  const { user } = useAuth();
  const [nouns, setNouns] = useState<GermanNoun[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  // Session settings
  const [sessionState, setSessionState] = useState<SessionState>('settings');
  const [nounCount, setNounCount] = useState(10);
  const [secondsPerNoun, setSecondsPerNoun] = useState(5);
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState(secondsPerNoun);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add a new piece of state to store the final session time
  const [finalSessionTime, setFinalSessionTime] = useState(0);

  // Fetch nouns for practice
  const fetchNouns = useCallback(async (count: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/nouns/random?count=${count}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch nouns');
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        setNouns(data);
        setSessionStartTime(new Date());
        setElapsedTime(0);
        setCurrentQuestionStartTime(Date.now());
        setTimePerQuestion([]);
      } else {
        // Fallback to simple nouns if API fails
        const fallbackNouns = [
          { id: 1, word: 'Haus', article: 'das', translation: 'house' },
          { id: 2, word: 'Frau', article: 'die', translation: 'woman' },
          { id: 3, word: 'Mann', article: 'der', translation: 'man' },
          { id: 4, word: 'Kind', article: 'das', translation: 'child' },
          { id: 5, word: 'Buch', article: 'das', translation: 'book' },
        ];
        
        // If we need more nouns than our fallback list, duplicate some
        const expandedNouns = [...fallbackNouns];
        while (expandedNouns.length < count) {
          expandedNouns.push({
            ...fallbackNouns[expandedNouns.length % fallbackNouns.length],
            id: expandedNouns.length + 1
          });
        }
        
        setNouns(expandedNouns.slice(0, count));
        setSessionStartTime(new Date());
        setElapsedTime(0);
        setCurrentQuestionStartTime(Date.now());
        setTimePerQuestion([]);
      }
    } catch (error) {
      console.error('Error fetching nouns:', error);
      // Create a fallback list with the requested count
      const fallbackNouns = [];
      const baseNouns = [
        { word: 'Haus', article: 'das', translation: 'house' },
        { word: 'Frau', article: 'die', translation: 'woman' },
        { word: 'Mann', article: 'der', translation: 'man' },
        { word: 'Kind', article: 'das', translation: 'child' },
        { word: 'Buch', article: 'das', translation: 'book' },
      ];
      
      for (let i = 0; i < count; i++) {
        fallbackNouns.push({
          id: i + 1,
          ...baseNouns[i % baseNouns.length]
        });
      }
      
      setNouns(fallbackNouns);
      setSessionStartTime(new Date());
      setElapsedTime(0);
      setCurrentQuestionStartTime(Date.now());
      setTimePerQuestion([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start practice session
  const startSession = () => {
    fetchNouns(nounCount);
    setSessionState('practicing');
    setCurrentIndex(0);
    setScore(0);
    setResult(null);
    setSelectedArticle(null);
    setPracticeComplete(false);
    setSecondsRemaining(secondsPerNoun);
  };

  // Timer for auto-advancing questions
  useEffect(() => {
    // Only start timer when we're practicing AND nouns have been loaded
    if (sessionState !== 'practicing' || result !== null || nouns.length === 0 || currentIndex >= nouns.length) {
      // Clear any existing timer
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
      return;
    }
    
    // Set seconds remaining to initial value when question changes
    setSecondsRemaining(secondsPerNoun);
    
    // Start the timer for auto-advancing
    questionTimerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto select "skip"
          handleArticleSelect('skip');
          return secondsPerNoun;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    };
  }, [sessionState, result, currentIndex, nouns.length, secondsPerNoun]);

  // Session timer effect
  useEffect(() => {
    if (sessionState !== 'practicing') return;
    
    const intervalId = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [sessionState]);

  // Article selection handler - modified to remove feedback display
  const handleArticleSelect = (article: string) => {
    // Safety check
    if (nouns.length === 0 || currentIndex >= nouns.length) {
      return;
    }
    
    // Calculate time taken for this question
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - currentQuestionStartTime) / 1000);
    setTimePerQuestion([...timePerQuestion, timeTaken]);
    
    // Determine if answer is correct (but don't show feedback)
    const isCorrect = article === nouns[currentIndex].article;
    
    // Update score
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Here we set selectedArticle but NOT result
    // This removes the feedback message
    setSelectedArticle(article);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentIndex < nouns.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedArticle(null);
        setCurrentQuestionStartTime(Date.now());
        setSecondsRemaining(secondsPerNoun);
      } else {
        // End of practice - capture the final session time
        setFinalSessionTime(elapsedTime);
        setPracticeComplete(true);
        
        // Save session results if the user is logged in
        if (user) {
          saveSessionResults();
        }
      }
    }, 500); // Reduced from 1500ms to 500ms for faster transitions
  };

  // Save session results to backend
  const saveSessionResults = async () => {
    if (!user) return;
    
    try {
      const sessionData = {
        userId: user.id,
        date: new Date().toISOString(),
        score: Math.round((score / nouns.length) * 100),
        totalNouns: nouns.length,
        correctAnswers: score,
        incorrectAnswers: nouns.length - score,
        skippedAnswers: 0,
        secondsPerNoun: timePerQuestion.length > 0 
          ? Math.round(timePerQuestion.reduce((sum, time) => sum + time, 0) / timePerQuestion.length) 
          : 0,
        totalTime: finalSessionTime, // Use the captured final time
      };
      
      await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Error saving session results:', error);
    }
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get button class function - modified to show visual feedback
  const getArticleButtonClass = (article: string) => {
    const baseClasses = "px-6 py-3 text-lg rounded-md font-bold transition";
    
    if (selectedArticle === article) {
      // Show correct/incorrect visually with colors
      const isCorrect = nouns[currentIndex]?.article === article;
      return `${baseClasses} ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
    }
    
    return `${baseClasses} bg-gray-200 hover:bg-gray-300 text-gray-800`;
  };

  // Start a new session
  const startNewSession = () => {
    setSessionState('settings');
    setPracticeComplete(false);
  };

  // Settings screen render
  if (sessionState === 'settings') {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Practice Settings</h1>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Number of Nouns: {nounCount}
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="100" 
                  value={nounCount} 
                  onChange={(e) => setNounCount(parseInt(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Seconds per Noun: {secondsPerNoun}
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={secondsPerNoun} 
                  onChange={(e) => setSecondsPerNoun(parseInt(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>8</span>
                  <span>15</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h3 className="font-medium text-gray-700 mb-2">Session Summary</h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">{nounCount}</span> nouns × <span className="font-medium">{secondsPerNoun}</span> seconds per noun
                </p>
                <p className="text-gray-600 text-sm">
                  Estimated duration: <span className="font-medium">{Math.round(nounCount * secondsPerNoun / 60)}</span> minutes
                </p>
              </div>
              
              <button
                onClick={startSession}
                className="w-full py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Start Session'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results screen render
  if (practiceComplete) {
    // Calculate statistics
    const accuracy = Math.round((score / nouns.length) * 100);
    const avgTimePerQuestion = timePerQuestion.length ? 
      Math.round(timePerQuestion.reduce((sum, time) => sum + time, 0) / timePerQuestion.length) : 
      0;
    
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Practice Results</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Score</p>
                  <p className="text-3xl font-bold text-indigo-600">{score}/{nouns.length}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Accuracy</p>
                  <p className="text-3xl font-bold text-indigo-600">{accuracy}%</p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Avg. Time</p>
                  <p className="text-3xl font-bold text-indigo-600">{avgTimePerQuestion}s</p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Total Time</p>
                  <p className="text-3xl font-bold text-indigo-600">{formatTime(finalSessionTime)}</p>
                </div>
              </div>
              
              {user ? (
                <p className="text-center text-green-600 mb-6">
                  Your progress has been saved to your account.
                </p>
              ) : (
                <p className="text-center text-indigo-600 mb-6">
                  <a href="/login" className="underline">Sign in</a> to save your progress and track improvements.
                </p>
              )}
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startNewSession}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Practice interface
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Practice German Articles</h1>
            <div className="text-gray-600 flex items-center">
              <span className="mr-4">{currentIndex + 1} of {nouns.length}</span>
              <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>
          
          {nouns.length > 0 && currentIndex < nouns.length && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              {/* Timer countdown */}
              <div className="flex justify-end mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  secondsRemaining <= 2 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {secondsRemaining}s
                </span>
              </div>
              
              {/* Word display */}
              <div className="text-center mb-8">
                <p className="text-3xl font-bold mb-3">{nouns[currentIndex].word}</p>
                <p className="text-xl text-gray-600">"{nouns[currentIndex].translation}"</p>
                
                {nouns[currentIndex].example && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="italic text-gray-700">{nouns[currentIndex].example}</p>
                    {nouns[currentIndex].example_translation && (
                      <p className="text-gray-600 text-sm mt-1">{nouns[currentIndex].example_translation}</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Article selection */}
              <div className="flex justify-center space-x-4 mb-6">
                {['der', 'die', 'das'].map((article) => (
                  <button
                    key={article}
                    onClick={() => handleArticleSelect(article)}
                    disabled={selectedArticle !== null}
                    className={getArticleButtonClass(article)}
                  >
                    {article}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Practice stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Current score</p>
                <p className="text-2xl font-bold">{score}/{currentIndex + (selectedArticle !== null ? 1 : 0)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600">Time</p>
                <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
              </div>
              
              <div className="text-right">
                <p className="text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold">
                  {currentIndex === 0 && selectedArticle === null 
                    ? "-" 
                    : `${Math.round((score / (currentIndex + (selectedArticle !== null ? 1 : 0))) * 100)}%`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 