import { NextResponse } from 'next/server';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '@/firebase/config'; // adjust if your config path is different

const db = getFirestore(app);

export async function POST(req) {
  try {
    const body = await req.json();
    const { tweetId, name, username, text, date, points = 10 } = body;

    if (!tweetId || !name || !username || !text || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await addDoc(collection(db, 'comments'), {
      tweetId,
      name,
      username,
      text,
      date,
      storedAt: new Date().toISOString(),
      points,
    });

    return NextResponse.json({ message: 'Comment stored successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error storing comment:', err);
    return NextResponse.json({ error: 'Failed to store comment' }, { status: 500 });
  }
}
