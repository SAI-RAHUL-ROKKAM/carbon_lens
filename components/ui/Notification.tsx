"use client";
import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  show: boolean;
  onDismiss: () => void;
  duration?: number;
}

export default function Notification({
  message,
  show,
  onDismiss,
  duration = 3000,
}: NotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsExiting(false);
        onDismiss();
      }, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onDismiss]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        animation: isExiting
          ? "slideOutBottom 300ms var(--ease-primary) forwards"
          : "slideInBottom 300ms var(--ease-primary)",
      }}
    >
      <div
        style={{
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "12px 24px",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="var(--accent-primary)" strokeWidth="1.5" />
          <path d="M5 8l2 2 4-4" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {message}
      </div>
    </div>
  );
}
