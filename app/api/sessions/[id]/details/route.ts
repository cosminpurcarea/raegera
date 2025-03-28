import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check auth
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session ID from URL
    const { id } = params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    console.log(`Fetching details for session ID: ${sessionId}`);

    // For testing - mock data while you set up your database
    return NextResponse.json([
      {
        id: 1,
        sessionId: sessionId,
        nounId: 1,
        word: "Haus",
        article: "das",
        translation: "house",
        userAnswer: "das",
        isCorrect: true,
        timeSpent: 3
      },
      {
        id: 2,
        sessionId: sessionId,
        nounId: 2,
        word: "Auto",
        article: "das",
        translation: "car",
        userAnswer: "die",
        isCorrect: false,
        timeSpent: 5
      },
      {
        id: 3,
        sessionId: sessionId,
        nounId: 3,
        word: "Frau",
        article: "die",
        translation: "woman",
        userAnswer: "die",
        isCorrect: true,
        timeSpent: 2
      },
      {
        id: 4,
        sessionId: sessionId,
        nounId: 4,
        word: "Mann",
        article: "der",
        translation: "man",
        userAnswer: "der",
        isCorrect: true,
        timeSpent: 2
      },
      {
        id: 5,
        sessionId: sessionId,
        nounId: 5,
        word: "Buch",
        article: "das",
        translation: "book",
        userAnswer: "der",
        isCorrect: false,
        timeSpent: 4
      }
    ]);

    // Uncomment the following when your database is set up
    /*
    // Get the session and check if it belongs to the user
    const practiceSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!practiceSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (practiceSession.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get session details from the database
    const sessionDetails = await prisma.sessionDetail.findMany({
      where: { sessionId },
      include: { noun: true },
      orderBy: { id: 'asc' }
    });

    // Format the response
    const formattedDetails = sessionDetails.map(detail => ({
      id: detail.id,
      sessionId: detail.sessionId,
      nounId: detail.nounId,
      word: detail.noun.word,
      article: detail.noun.article,
      translation: detail.noun.translation,
      userAnswer: detail.userAnswer,
      isCorrect: detail.isCorrect,
      timeSpent: detail.timeSpent
    }));

    return NextResponse.json(formattedDetails);
    */
  } catch (error) {
    console.error('Error fetching session details:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching session details' },
      { status: 500 }
    );
  }
} 