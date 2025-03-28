import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || '';
  const search = searchParams.get('search') || '';
  
  try {
    // Use the public NEXT_PUBLIC variables instead of server-only ones
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Connecting to Supabase with URL:', supabaseUrl);
    console.log('Anon key exists:', !!supabaseAnonKey);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // The correct table name and query structure
    let query = supabase.from('nouns').select('*');
    
    if (filter) {
      query = query.eq('article', filter);
    }
    
    if (search) {
      // Fix OR syntax for Supabase
      query = query.or(`word.ilike.%${search}%,translation.ilike.%${search}%`.replace(/%/g, ''));
    }
    
    // Add limit for better performance
    query = query.order('word').limit(100);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (err) {
    // Detailed error logging
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 