'use client';

import { useEffect } from 'react';

export interface ViewerSession {
  id: string;
  ip?: string;
  startTime: number;
  lastActiveTime: number;
  duration: number;
}

const STORAGE_KEY = 'wfs_viewer_sessions';
const SESSION_ID_KEY = 'wfs_session_id';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity = session end

export function useAnalytics() {
  useEffect(() => {
    // Get or create session ID
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    // Get existing sessions
    const sessionsJson = localStorage.getItem(STORAGE_KEY);
    const sessions: ViewerSession[] = sessionsJson ? JSON.parse(sessionsJson) : [];

    // Find or create current session
    let currentSession = sessions.find((s) => s.id === sessionId);
    if (!currentSession) {
      currentSession = {
        id: sessionId,
        ip: undefined,
        startTime: Date.now(),
        lastActiveTime: Date.now(),
        duration: 0,
      };
      sessions.push(currentSession);

      // Fetch public IP asynchronously
      fetch('https://api64.ipify.org?format=json')
        .then((response) => response.json())
        .then((data) => {
          currentSession!.ip = data.ip;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        })
        .catch((err) => {
          console.error('Failed to fetch IP:', err);
          // Continue without IP if fetch fails
        });
    }

    // Update last active time and save
    const updateActivity = () => {
      currentSession!.lastActiveTime = Date.now();
      currentSession!.duration = currentSession!.lastActiveTime - currentSession!.startTime;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    };

    // Update on mount
    updateActivity();

    // Track user activity (click, keyboard, etc.)
    const handleActivity = () => {
      updateActivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('mousemove', handleActivity);

    // Update activity every 5 seconds
    const interval = setInterval(updateActivity, 5000);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      clearInterval(interval);
    };
  }, []);
}

export function getViewerSessions(): ViewerSession[] {
  if (typeof window === 'undefined') return [];
  const sessionsJson = localStorage.getItem(STORAGE_KEY);
  return sessionsJson ? JSON.parse(sessionsJson) : [];
}

export function clearViewerSessions() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
}
