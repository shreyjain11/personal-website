import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client - Vercel will auto-inject these env vars
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    // Increment the counter in Upstash Redis
    // The incr command atomically increments and returns the new value
    const count = await redis.incr('shrey-portfolio-visits');
    
    // Add 100 to start from 100 instead of 0
    const totalVisits = Number(count) + 100;
    
    return NextResponse.json({ count: totalVisits });
  } catch (error) {
    console.error('Failed to increment counter:', error);
    // Return a fallback value if Redis is not set up yet
    return NextResponse.json({ count: 100 });
  }
}

export async function POST() {
  // Alternative endpoint if you want to separate getting and incrementing
  return GET();
}
