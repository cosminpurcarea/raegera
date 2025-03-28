import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the session data type
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

// POST handler to save a new session
export async function POST(request: Request) {
  try {
    const sessionData = await request.json();
    // For now just return success
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET handler to fetch user's sessions
export async function GET(request: Request) {
  try {
    // For now just return mock data
    const mockSessions = generateMockSessionData();
    return NextResponse.json(mockSessions);
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Generate mock session data
function generateMockSessionData() {
  const sessions = [];
  const now = new Date();
  
  // Generate sessions for the last 14 days
  for (let i = 0; i < 14; i++) {
    const sessionsPerDay = Math.floor(Math.random() * 3) + 1; // 1-3 sessions per day
    
    for (let j = 0; j < sessionsPerDay; j++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(Math.floor(Math.random() * 12) + 8); // Between 8AM and 8PM
      
      const totalNouns = Math.floor(Math.random() * 20) + 10; // 10-30 nouns
      const correctAnswers = Math.floor(Math.random() * (totalNouns * 0.8)) + Math.floor(totalNouns * 0.2); // At least 20% correct
      const incorrectAnswers = Math.floor(Math.random() * (totalNouns - correctAnswers));
      const skippedAnswers = totalNouns - correctAnswers - incorrectAnswers;
      const score = Math.round((correctAnswers / totalNouns) * 100);
      const secondsPerNoun = Math.floor(Math.random() * 6) + 3; // 3-8 seconds per noun
      
      sessions.push({
        id: sessions.length + 1,
        date: date.toISOString(),
        score,
        totalNouns,
        correctAnswers,
        incorrectAnswers,
        skippedAnswers,
        secondsPerNoun,
        totalTime: totalNouns * secondsPerNoun
      });
    }
  }
  
  // Sort by date, newest first
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
} 