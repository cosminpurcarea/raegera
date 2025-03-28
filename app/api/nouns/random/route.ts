import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10');
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Fetch random nouns with a limit
    const { data, error } = await supabase
      .from('nouns')
      .select('*')
      .order('id', { ascending: false }) // Adding order to make the query more efficient
      .limit(count);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Shuffle the results to randomize them
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    
    // Take only the number requested
    const randomNouns = shuffled.slice(0, count);
    
    return NextResponse.json(randomNouns);
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 