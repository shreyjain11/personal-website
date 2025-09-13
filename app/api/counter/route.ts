import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.log('Upstash environment variables not set');
      return NextResponse.json({ 
        count: 100,
        error: 'Redis not configured'
      });
    }

    // Initialize Redis client inside the function to ensure fresh connection
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    // Increment the counter in Upstash Redis
    const count = await redis.incr('shrey-portfolio-visits');
    
    // Add 100 to start from 100 instead of 0
    const totalVisits = Number(count) + 100;
    
    console.log('Visit count:', totalVisits);
    
    return NextResponse.json({ 
      count: totalVisits,
      success: true 
    });
  } catch (error) {
    console.error('Failed to increment counter:', error);
    // Return a more detailed error response
    return NextResponse.json({ 
      count: 100,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}
