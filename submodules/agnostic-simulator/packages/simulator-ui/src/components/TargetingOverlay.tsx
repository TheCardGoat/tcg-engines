import { useEffect, useRef, useState } from "react";

import type { SimulatorTargetingIntent } from "@tcg/simulator-contract";

import { TargetingArrow } from "./TargetingArrow";
import { TargetingPreviewBadge } from "./TargetingPreviewBadge";
import { TargetingSpotlight } from "./TargetingSpotlight";

interface TargetingLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  preview?: { damage?: number; banish?: boolean };
}

interface Rect {
  left: number;
  top: number;
}

export interface TargetingOverlayProps {
  targetingIntents: SimulatorTargetingIntent[];
  containerSelector?: string;
}

export function TargetingOverlay({
  targetingIntents,
  containerSelector = ".board-mat",
}: TargetingOverlayProps) {
  const [lines, setLines] = useState<TargetingLine[]>([]);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const getEntityRect = (entityId: string, rect: DOMRect | null): Rect | null => {
    const el = document.querySelector(`[data-entity-id="${entityId}"]`);
    if (!el || !rect) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left - rect.left + r.width / 2, top: r.top - rect.top + r.height / 2 };
  };

  const updateLines = () => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    setContainerRect(cRect);

    const newLines: TargetingLine[] = [];
    for (const intent of targetingIntents) {
      const sourceCenter = getEntityRect(intent.sourceEntityId, cRect);
      if (!sourceCenter) continue;

      for (const targetId of intent.targetEntityIds) {
        const targetCenter = getEntityRect(targetId, cRect);
        if (!targetCenter) continue;
        newLines.push({
          id: `${intent.id}-${targetId}`,
          x1: sourceCenter.left,
          y1: sourceCenter.top,
          x2: targetCenter.left,
          y2: targetCenter.top,
          preview: intent.preview,
        });
      }

      for (const zoneId of intent.targetZoneIds) {
        const zoneEl = document.querySelector(`[data-zone-id="${zoneId}"]`);
        if (!zoneEl || !cRect) continue;
        const zRect = zoneEl.getBoundingClientRect();
        newLines.push({
          id: `${intent.id}-zone-${zoneId}`,
          x1: sourceCenter.left,
          y1: sourceCenter.top,
          x2: zRect.left - cRect.left + zRect.width / 2,
          y2: zRect.top - cRect.top + zRect.height / 2,
          preview: intent.preview,
        });
      }
    }
    setLines(newLines);
  };

  useEffect(() => {
    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateLines);
    };

    schedule();
    const resizeObserver = new ResizeObserver(schedule);
    const boardEl = document.querySelector(containerSelector);
    if (boardEl) resizeObserver.observe(boardEl);
    window.addEventListener("resize", schedule);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [targetingIntents, containerSelector]);

  if (!lines.length || !containerRect) return null;

  const containerW = containerRect.width;
  const containerH = containerRect.height;
  const spotlightSource = lines[0]
    ? { x: lines[0].x1, y: lines[0].y1 }
    : { x: containerW / 2, y: containerH / 2 };
  const spotlightTarget = lines[0]
    ? { x: lines[0].x2, y: lines[0].y2 }
    : { x: containerW / 2, y: containerH / 2 };

  return (
    <div className="targeting-overlay pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      <TargetingSpotlight
        sourceX={spotlightSource.x}
        sourceY={spotlightSource.y}
        targetX={spotlightTarget.x}
        targetY={spotlightTarget.y}
        width={containerW}
        height={containerH}
      />
      <svg
        className="targeting-overlay-svg absolute inset-0"
        width={containerW}
        height={containerH}
        viewBox={`0 0 ${containerW} ${containerH}`}
      >
        {lines.map((line) => (
          <TargetingArrow
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            curved
            animated
          />
        ))}
      </svg>
      {lines.map((line) =>
        line.preview ? (
          <TargetingPreviewBadge
            key={`${line.id}-badge`}
            x={line.x2}
            y={line.y2}
            damage={line.preview.damage}
            banish={line.preview.banish}
          />
        ) : null,
      )}
    </div>
  );
}
