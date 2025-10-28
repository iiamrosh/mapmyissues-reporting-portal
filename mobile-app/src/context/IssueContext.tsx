import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Issue } from '../types';
import { fetchAllIssuesWithVotes, subscribeRealtime } from '../services/supabase';
import { useAuth } from './AuthContext';

interface IssueContextType {
  issues: Issue[];
  loading: boolean;
  refreshIssues: () => Promise<void>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshIssues();
      const unsubscribe = subscribeRealtime(() => {
        refreshIssues();
      });
      return () => unsubscribe();
    }
  }, [user]);

  const refreshIssues = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAllIssuesWithVotes(user.username);
      setIssues(data);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        loading,
        refreshIssues,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
