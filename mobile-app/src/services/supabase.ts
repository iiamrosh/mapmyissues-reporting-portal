import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET } from '../constants/config';
import { Issue } from '../types';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const getSupabase = () => supabase;

// Map database row to client Issue format
function mapDbIssueToClient(issueRow: any, userVotedIssues: Set<string>, username: string): Issue {
  const votedBy = userVotedIssues.has(issueRow.id) ? [username] : [];
  const voteCount = issueRow.votes?.[0]?.count || 0;
  
  return {
    id: issueRow.id,
    type: issueRow.type,
    description: issueRow.description,
    location: issueRow.location,
    coordinates: { lat: issueRow.latitude, lng: issueRow.longitude },
    photo: issueRow.photo_url || '',
    votes: voteCount,
    priority: issueRow.priority,
    status: issueRow.status,
    department: issueRow.department || '',
    expense: issueRow.expense || 0,
    createdAt: new Date(issueRow.created_at).getTime(),
    votedBy
  };
}

// Fetch all issues with vote information
export async function fetchAllIssuesWithVotes(username: string): Promise<Issue[]> {
  const [issuesRes, votesRes] = await Promise.all([
    supabase.from('issues').select('*').order('created_at', { ascending: false }),
    supabase.from('votes').select('issue_id').eq('user_name', username)
  ]);

  if (issuesRes.error) throw issuesRes.error;
  if (votesRes.error) throw votesRes.error;

  const userVotedIssues = new Set(votesRes.data.map((v: any) => v.issue_id));
  const result = (issuesRes.data || []).map((row: any) => 
    mapDbIssueToClient(row, userVotedIssues, username)
  );

  return result;
}

// Upload photo to Supabase Storage
export async function uploadPhoto(uri: string, fileName: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const fileExt = fileName.split('.').pop() || 'jpg';
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, blob, { upsert: false });
  
  if (error) throw error;
  
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// Create new issue
export async function createIssue(payload: any) {
  const { data, error } = await supabase
    .from('issues')
    .insert([payload])
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

// Add vote to issue
export async function addVote(issueId: string, userName: string) {
  const existing = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('issue_id', issueId)
    .eq('user_name', userName);
  
  if (existing.error) throw existing.error;
  if ((existing.count || 0) > 0) return { already: true };
  
  const { error } = await supabase
    .from('votes')
    .insert([{ issue_id: issueId, user_name: userName }]);
  
  if (error) throw error;
  return { ok: true };
}

// Update issue
export async function updateIssue(issueId: string, fields: any) {
  const { error } = await supabase
    .from('issues')
    .update(fields)
    .eq('id', issueId);
  
  if (error) throw error;
}

// Delete issue
export async function deleteIssue(issueId: string) {
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', issueId);
  
  if (error) throw error;
}

// Log login
export async function logLogin(username: string, role: string) {
  const { error } = await supabase
    .from('login_logs')
    .insert([{ username, role }]);
  
  if (error) throw error;
}

// Log logout
export async function logLogout(username: string) {
  const { data: activeLogins, error: fetchError } = await supabase
    .from('login_logs')
    .select('*')
    .eq('username', username)
    .is('logged_out_at', null)
    .order('timestamp', { ascending: false });
  
  if (fetchError) throw fetchError;
  
  if (activeLogins && activeLogins.length > 0) {
    const { error } = await supabase
      .from('login_logs')
      .update({ logged_out_at: new Date().toISOString() })
      .eq('id', activeLogins[0].id);
    
    if (error) throw error;
  }
}

// Register user
export async function registerUser(username: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
        role: 'citizen'
      }
    }
  });
  
  if (error) throw error;
  return data;
}

// Subscribe to realtime changes
export function subscribeRealtime(onChange: () => void) {
  const channel = supabase.channel('issues-and-votes');
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, onChange);
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, onChange);
  channel.subscribe();
  
  return () => supabase.removeChannel(channel);
}
