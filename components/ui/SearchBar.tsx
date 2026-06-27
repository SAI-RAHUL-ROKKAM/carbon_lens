"use client";
import React, { useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { SearchResult } from "@/types";
import ScoreBadge from "./ScoreBadge";
import { formatCredits } from "@/lib/scoreUtils";

interface SearchBarProps {
  onSelectProject: (project: SearchResult) => void;
}

export default function SearchBar({ onSelectProject }: SearchBarProps) {
  const {
    query,
    results,
    isLoading,
    isOpen,
    error,
    selectedIndex,
    handleInputChange,
    handleKeyDown,
    close,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  const handleSelect = (project: SearchResult) => {
    close();
    onSelectProject(project);
  };

  const handleKeyDownWrapper = (e: React.KeyboardEvent) => {
    handleKeyDown(e);
    if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <div style={{ position: "relative", width: "480px", zIndex: 50 }}>
      {/* Search Input */}
      <div style={{ position: "relative" }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: isLoading ? "var(--accent-primary)" : "var(--text-muted)",
            transition: "color 0.2s",
            animation: isLoading ? "pulse 1s ease-in-out infinite" : "none",
          }}
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search project name or company..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDownWrapper}
          onFocus={() => {
            if (results.length > 0) close();
          }}
          style={{
            width: "100%",
            padding: "14px 20px 14px 44px",
            background: "#ffffff",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            color: "#0F172A",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s var(--ease-primary)",
            boxSizing: "border-box",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent-primary)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-subtle)")
          }
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            overflow: "hidden",
            animation: "fadeIn 150ms var(--ease-primary)",
          }}
        >
          {error ? (
            <div
              style={{
                padding: "16px 20px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--accent-warn)",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          ) : results.length === 0 ? (
            <div
              style={{
                padding: "16px 20px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              No projects found — try a different name or country
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  borderBottom:
                    index < results.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  background:
                    index === selectedIndex
                      ? "var(--bg-elevated)"
                      : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-elevated)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    index === selectedIndex
                      ? "var(--bg-elevated)"
                      : "transparent")
                }
              >
                <div style={{ flex: 1, minWidth: 0, marginRight: "12px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {result.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span>{result.country}</span>
                    <span>·</span>
                    <span>{result.projectType}</span>
                    {result.creditsIssued > 0 && (
                      <>
                        <span>·</span>
                        <span>{formatCredits(result.creditsIssued)} credits</span>
                      </>
                    )}
                  </div>
                </div>
                {result.integrityScore !== undefined && result.integrityScore > 0 && (
                  <ScoreBadge score={result.integrityScore} />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
