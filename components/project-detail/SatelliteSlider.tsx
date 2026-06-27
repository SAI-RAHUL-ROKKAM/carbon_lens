"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { getCountryCoordinates } from "@/lib/scoreUtils";

interface SatelliteSliderProps {
  coordinates?: { lat: number; lng: number } | null;
  country: string;
  areaHectares?: number;
}

// Esri Wayback tile URLs — real historical snapshots from official config
// Release 25944 = 2019-01-31, Release 12428 = 2024-06-06
const WAYBACK_2019 = 25944;
const WAYBACK_2024 = 12428;

function getEsriTile(lat: number, lng: number, release: number): string {
  const zoom = 10;
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${release}/${zoom}/${y}/${x}`;
}

export default function SatelliteSlider({
  coordinates,
  country,
  areaHectares,
}: SatelliteSliderProps) {
  // --- Drag state (useRef for isDragging to avoid stale closures) ---
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  // Image loading/error states
  const [img2019Loaded, setImg2019Loaded] = useState(false);
  const [img2024Loaded, setImg2024Loaded] = useState(false);
  const [img2019Error, setImg2019Error] = useState(false);
  const [img2024Error, setImg2024Error] = useState(false);

  // Resolve coordinates
  const resolvedCoords = coordinates ?? getCountryCoordinates(country);
  const hasCoords = !!(
    resolvedCoords &&
    (resolvedCoords.lat !== 0 || resolvedCoords.lng !== 0)
  );

  const image2019Url = hasCoords
    ? getEsriTile(resolvedCoords!.lat, resolvedCoords!.lng, WAYBACK_2019)
    : null;
  const image2024Url = hasCoords
    ? getEsriTile(resolvedCoords!.lat, resolvedCoords!.lng, WAYBACK_2024)
    : null;

  const isLoading =
    hasCoords &&
    ((!img2019Loaded && !img2019Error) || (!img2024Loaded && !img2024Error));

  // Reset loading states when coordinates change
  useEffect(() => {
    setImg2019Loaded(false);
    setImg2024Loaded(false);
    setImg2019Error(false);
    setImg2024Error(false);
  }, [resolvedCoords?.lat, resolvedCoords?.lng]);

  // --- DRAG HANDLERS (window-level for reliability) ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div>
      <div
        ref={sliderRef}
        style={{
          position: "relative",
          overflow: "hidden",
          cursor: "ew-resize",
          userSelect: "none",
          WebkitUserSelect: "none",
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: "6px",
          border: "1px solid var(--border-subtle)",
          background: "#111",
        }}
      >
        {/* Loading state */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#111",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTopColor: "var(--accent-primary)",
                animation: "spin 1s linear infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              Loading satellite imagery...
            </span>
          </div>
        )}

        {/* 2024 image — right side, full vivid color */}
        {image2024Url && !img2024Error ? (
          <img
            src={image2024Url}
            alt={`Satellite view of ${country} — 2024`}
            onLoad={() => setImg2024Loaded(true)}
            onError={() => setImg2024Error(true)}
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              clipPath: `inset(0 0 0 ${position}%)`,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#1a1a1a",
              clipPath: `inset(0 0 0 ${position}%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              Imagery unavailable
            </span>
          </div>
        )}

        {/* 2019 image — left side, historical snapshot */}
        {image2019Url && !img2019Error ? (
          <img
            src={image2019Url}
            alt={`Satellite view of ${country} — 2019`}
            onLoad={() => setImg2019Loaded(true)}
            onError={() => setImg2019Error(true)}
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#1a1a1a",
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              Imagery unavailable
            </span>
          </div>
        )}

        {/* Year labels */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            padding: "2px 8px",
            borderRadius: "3px",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          2019
        </div>
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            padding: "2px 8px",
            borderRadius: "3px",
            zIndex: 8,
            pointerEvents: "none",
          }}
        >
          2024
        </div>

        {/* Vertical divider line */}
        <div
          style={{
            position: "absolute",
            left: `${position}%`,
            top: 0,
            height: "100%",
            width: "2px",
            backgroundColor: "white",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Drag handle circle — onMouseDown goes HERE */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            left: `${position}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "ew-resize",
            zIndex: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
            userSelect: "none",
            fontSize: "14px",
            color: "#333",
            fontWeight: 600,
          }}
        >
          ‹›
        </div>
      </div>

      {/* Metadata */}
      <div
        style={{
          marginTop: "10px",
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          color: "var(--text-muted)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          {resolvedCoords && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {resolvedCoords.lat.toFixed(4)}°, {resolvedCoords.lng.toFixed(4)}°
            </span>
          )}
          <span>{country}</span>
          {areaHectares !== undefined && (
            <span>{areaHectares.toLocaleString()} ha</span>
          )}
        </div>
        <span>Esri World Imagery · Satellite · ArcGIS</span>
      </div>
    </div>
  );
}
