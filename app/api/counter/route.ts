import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Increment the counter in Vercel KV
    // The incr command atomically increments and returns the new value
    const count = await kv.incr('shrey-portfolio-visits');
    
    // Add 100 to start from 100 instead of 0
    const totalVisits = count + 100;
    
    return NextResponse.json({ count: totalVisits });
  } catch (error) {
    console.error('Failed to increment counter:', error);
    // Return a fallback value if KV is not set up yet
    return NextResponse.json({ count: 100 });
  }
}

export async function POST() {
  // Alternative endpoint if you want to separate getting and incrementing
  return GET();
}
