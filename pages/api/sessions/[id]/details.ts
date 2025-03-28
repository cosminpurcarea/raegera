import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, NextApiResponse) {
  try {
    // Check auth
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get session ID from URL
    const { id } = req.query;
    const sessionId = parseInt(id as string);

    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    // Get the session and check if it belongs to the user
    const practiceSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!practiceSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (practiceSession.user.email !== session.user.email) {
      return res.status(403).json({ error: 'Forbidden' });
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

    return res.status(200).json(formattedDetails);
  } catch (error) {
    console.error('Error fetching session details:', error);
    return res.status(500).json({ error: 'An error occurred while fetching session details' });
  }
} 