'use client';

import { useEffect, useState } from 'react';
import { getViewerSessions, clearViewerSessions, ViewerSession } from '@/hooks/useAnalytics';

export default function AdminAnalyticsPage() {
  const [sessions, setSessions] = useState<ViewerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load sessions from localStorage
    const loadSessions = () => {
      const data = getViewerSessions();
      setSessions(data.sort((a, b) => b.startTime - a.startTime));
      setIsLoading(false);
    };

    loadSessions();

    // Refresh every 5 seconds
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all viewer analytics data?')) {
      clearViewerSessions();
      setSessions([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-[var(--foreground)]">Loading...</div>
      </div>
    );
  }

  const totalViewers = sessions.length;
  const totalViewTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const averageViewTime = totalViewers > 0 ? totalViewTime / totalViewers : 0;

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Admin Analytics</h1>
          <p className="text-[var(--surface-border)]">Viewer tracking & session duration</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg bg-[var(--surface)] p-6 shadow-md border border-[var(--surface-border)]/20">
            <div className="text-[var(--surface-border)] text-sm font-medium mb-2">Total Viewers</div>
            <div className="text-3xl font-bold text-[var(--accent)]">{totalViewers}</div>
          </div>

          <div className="rounded-lg bg-[var(--surface)] p-6 shadow-md border border-[var(--surface-border)]/20">
            <div className="text-[var(--surface-border)] text-sm font-medium mb-2">Total View Time</div>
            <div className="text-3xl font-bold text-[var(--accent)]">{formatDuration(totalViewTime)}</div>
          </div>

          <div className="rounded-lg bg-[var(--surface)] p-6 shadow-md border border-[var(--surface-border)]/20">
            <div className="text-[var(--surface-border)] text-sm font-medium mb-2">Avg. View Time</div>
            <div className="text-3xl font-bold text-[var(--accent)]">{formatDuration(averageViewTime)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-lg bg-red-600/20 text-red-600 border border-red-600/30 hover:bg-red-600/30 transition"
          >
            Clear All Data
          </button>
        </div>

        {/* Sessions Table */}
        <div className="rounded-lg bg-[var(--surface)] shadow-md overflow-hidden border border-[var(--surface-border)]/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--surface-border)]/30 bg-[var(--surface-muted)]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Session ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">IP Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Start Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--surface-border)]">
                      No viewer sessions yet
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session.id} className="border-b border-[var(--surface-border)]/20 hover:bg-[var(--surface-muted)]/50 transition">
                      <td className="px-6 py-4 text-sm text-[var(--foreground)] font-mono break-all">{session.id}</td>
                      <td className="px-6 py-4 text-sm text-[var(--foreground)] font-mono">{session.ip || '—'}</td>
                      <td className="px-6 py-4 text-sm text-[var(--foreground)]">{formatDate(session.startTime)}</td>
                      <td className="px-6 py-4 text-sm text-[var(--foreground)]">{formatDate(session.lastActiveTime)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[var(--accent)]">{formatDuration(session.duration)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[var(--surface-border)]">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p>Data is stored locally in browser localStorage</p>
        </div>
      </div>
    </div>
  );
}
