import { supabase } from './supabase';

export async function createUserProfile(userId: string, email: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { user_id: userId, email, created_at: new Date() }
    ]);
  
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
} 