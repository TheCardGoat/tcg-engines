import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type {
  CombatVisualAnimationEvent,
  PhaseChangeVisualAnimationEvent,
  ResourceFloatVisualAnimationEvent,
  VisualAnimationEvent,
} from "./visualEvents.ts";

export interface VisualAnimationLayerProps {
  readonly events?: readonly VisualAnimationEvent[] | null;
  readonly children: ReactNode;
}

const DEFAULT_DURATION_MS = 520;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const MAX_SEEN_EVENT_IDS = 1000;

export function VisualAnimationLayer({ events = null, children }: VisualAnimationLayerProps) {
  const eventList = useMemo(() => (events ? [...events] : []), [events]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const seenOrderRef = useRef<string[]>([]);
  const timersRef = useRef<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      for (const timer of timersRef.current) {
        window.clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    for (const event of eventList) {
      if (!rememberSeenEvent(event.id, seenIdsRef.current, seenOrderRef.current)) {
        continue;
      }
      scheduleTimer(
        timersRef.current,
        () => {
          if (!overlay.isConnected) {
            return;
          }
          void playVisualEvent(event, overlay, timersRef.current);
        },
        event.delayMs ?? 0,
      );
    }
  }, [eventList]);

  return (
    <>
      {children}
      {mounted && (
        <div
          ref={overlayRef}
          className="pointer-events-none fixed inset-0 z-[1002] overflow-hidden"
          data-testid="visual-animation-overlay"
        />
      )}
    </>
  );
}

function rememberSeenEvent(eventId: string, seenIds: Set<string>, seenOrder: string[]): boolean {
  if (seenIds.has(eventId)) {
    return false;
  }

  seenIds.add(eventId);
  seenOrder.push(eventId);
  while (seenOrder.length > MAX_SEEN_EVENT_IDS) {
    const oldest = seenOrder.shift();
    if (oldest) {
      seenIds.delete(oldest);
    }
  }

  return true;
}

function playVisualEvent(
  event: VisualAnimationEvent,
  overlay: HTMLElement,
  timers: Set<number>,
): Promise<void> {
  switch (event.primitive) {
    case "combat":
      return playCombat(event, overlay, timers);
    case "phaseChange":
      return playPhaseChange(event, overlay, timers);
    case "resourceFloat":
      return playResourceFloat(event, overlay, timers);
  }
}

function playCombat(
  event: CombatVisualAnimationEvent,
  overlay: HTMLElement,
  timers: Set<number>,
): Promise<void> {
  const sourceRect = findEntityRect(event.sourceEntityId);
  const targetRect = event.targetEntityId
    ? findEntityRect(event.targetEntityId)
    : event.targetPlayerId
      ? findPlayerTargetRect(event.targetPlayerId)
      : null;

  if (!sourceRect || !targetRect) {
    return Promise.resolve();
  }

  const source = rectCenter(sourceRect);
  const target = rectCenter(targetRect);
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy);
  if (length < 8) {
    return Promise.resolve();
  }

  const durationMs = event.durationMs ?? DEFAULT_DURATION_MS;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const arrow = document.createElement("div");
  arrow.dataset.visualAnimationPrimitive = "combat";
  arrow.dataset.visualAnimationId = event.id;
  arrow.style.position = "fixed";
  arrow.style.left = `${source.x}px`;
  arrow.style.top = `${source.y}px`;
  arrow.style.width = `${length}px`;
  arrow.style.height = "3px";
  arrow.style.borderRadius = "999px";
  arrow.style.transformOrigin = "left center";
  arrow.style.background =
    event.reason === "declared"
      ? "linear-gradient(90deg, rgba(255,255,255,.9), rgba(255,211,85,.95), rgba(255,73,118,.95))"
      : "linear-gradient(90deg, rgba(255,255,255,.95), rgba(76,195,255,.95), rgba(45,107,255,.95))";
  arrow.style.boxShadow =
    event.reason === "declared" ? "0 0 16px rgba(255,73,118,.55)" : "0 0 18px rgba(76,195,255,.55)";

  if (event.reason === "declared") {
    arrow.style.transform = `translateY(-2px) rotate(${angle}deg) scaleX(0)`;
    overlay.appendChild(arrow);
    animateElement(
      arrow,
      [
        { transform: `translateY(-2px) rotate(${angle}deg) scaleX(0)`, opacity: 0.85 },
        {
          transform: `translateY(-2px) rotate(${angle}deg) scaleX(1)`,
          opacity: 1,
          offset: 0.55,
        },
        { transform: `translateY(-2px) rotate(${angle}deg) scaleX(1)`, opacity: 0.85 },
      ],
      { duration: durationMs, easing: EASE_OUT, fill: "forwards" },
    );
  } else {
    arrow.style.transform = `translateY(-2px) rotate(${angle}deg) scaleX(1)`;
    overlay.appendChild(arrow);
    animateElement(
      arrow,
      [
        { opacity: 1, filter: "brightness(1.4)" },
        { opacity: 0, filter: "brightness(2)" },
      ],
      { duration: durationMs, easing: "ease-out", fill: "forwards" },
    );
    pulseImpact(event.targetEntityId);
  }

  return removeAfter(arrow, durationMs, timers);
}

function playPhaseChange(
  event: PhaseChangeVisualAnimationEvent,
  overlay: HTMLElement,
  timers: Set<number>,
): Promise<void> {
  const durationMs = event.durationMs ?? 780;
  const banner = document.createElement("div");
  banner.dataset.visualAnimationPrimitive = "phaseChange";
  banner.dataset.visualAnimationId = event.id;
  banner.style.position = "fixed";
  banner.style.display = "flex";
  banner.style.alignItems = "center";
  banner.style.gap = "10px";
  banner.style.padding = "10px 18px";
  banner.style.border = "1px solid rgba(76,195,255,.55)";
  banner.style.borderRadius = "6px";
  banner.style.background = "rgba(6, 13, 30, .86)";
  banner.style.color = "white";
  banner.style.font = "700 13px/1.1 system-ui, sans-serif";
  banner.style.letterSpacing = ".08em";
  banner.style.textTransform = "uppercase";
  banner.style.boxShadow = "0 0 24px rgba(76,195,255,.28), 0 12px 36px rgba(0,0,0,.35)";

  const from = document.createElement("span");
  from.textContent = formatPhaseLabel(event.from);
  from.style.opacity = ".6";
  const arrow = document.createElement("span");
  arrow.textContent = ">";
  arrow.style.color = "rgba(76,195,255,.9)";
  const to = document.createElement("span");
  to.textContent = formatPhaseLabel(event.to);
  banner.append(from, arrow, to);

  const center = boardCenter();
  banner.style.left = `${center.x}px`;
  banner.style.top = `${center.y}px`;
  overlay.appendChild(banner);
  animateElement(
    banner,
    [
      { transform: "translate(-50%, -50%) translateX(30px)", opacity: 0, easing: EASE_OUT },
      { transform: "translate(-50%, -50%) translateX(0)", opacity: 1, offset: 0.18 },
      {
        transform: "translate(-50%, -50%) translateX(0)",
        opacity: 1,
        offset: 0.82,
        easing: "cubic-bezier(0.4, 0, 1, 1)",
      },
      { transform: "translate(-50%, -50%) translateX(-30px)", opacity: 0 },
    ],
    { duration: durationMs, easing: "linear", fill: "forwards" },
  );

  return removeAfter(banner, durationMs, timers);
}

function playResourceFloat(
  event: ResourceFloatVisualAnimationEvent,
  overlay: HTMLElement,
  timers: Set<number>,
): Promise<void> {
  const anchor = findResourceAnchor(event);
  if (!anchor) {
    return Promise.resolve();
  }

  const durationMs = event.durationMs ?? 760;
  const rect = anchor.getBoundingClientRect();
  const span = document.createElement("span");
  span.dataset.visualAnimationPrimitive = "resourceFloat";
  span.dataset.visualAnimationId = event.id;
  span.style.position = "fixed";
  span.style.left = `${rect.left + rect.width / 2}px`;
  span.style.top = `${rect.top}px`;
  span.style.transform = "translate(-50%, 0)";
  span.style.font = "800 13px/1 system-ui, sans-serif";
  span.style.padding = "4px 8px";
  span.style.borderRadius = "999px";
  span.style.color = event.delta >= 0 ? "#07131f" : "#fff5d6";
  span.style.background = event.delta >= 0 ? "#7cffb1" : "#ff4d5e";
  span.style.boxShadow =
    event.delta >= 0 ? "0 0 18px rgba(124,255,177,.45)" : "0 0 18px rgba(255,77,94,.45)";
  span.textContent = `${event.delta >= 0 ? "+" : ""}${event.delta}${event.label ? ` ${event.label}` : ""}`;

  overlay.appendChild(span);
  animateElement(
    span,
    [
      { transform: "translate(-50%, 0)", opacity: 0 },
      { transform: "translate(-50%, -12px)", opacity: 1, offset: 0.2 },
      { transform: "translate(-50%, -56px)", opacity: 0 },
    ],
    { duration: durationMs, easing: "ease-out", fill: "forwards" },
  );

  return removeAfter(span, durationMs, timers);
}

function findEntityRect(entityId: string): DOMRect | null {
  const element = findBySelectors([
    `[data-sim-entity-id="${cssAttributeValue(entityId)}"]`,
    `[data-card-id="${cssAttributeValue(entityId)}"]`,
  ]);
  if (!element) {
    return null;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? rect : null;
}

function findPlayerTargetRect(playerId: string): DOMRect | null {
  const element = findBySelectors([
    `[data-sim-player-target-id="${cssAttributeValue(playerId)}"]`,
    `[data-sim-player-id="${cssAttributeValue(playerId)}"]`,
  ]);
  if (!element) {
    return null;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? rect : null;
}

function findResourceAnchor(event: ResourceFloatVisualAnimationEvent): HTMLElement | null {
  return findBySelectors([
    event.anchorId ? `[data-sim-resource-anchor-id="${cssAttributeValue(event.anchorId)}"]` : "",
    `[data-sim-resource-anchor-id="${cssAttributeValue(event.playerId)}"]`,
    `[data-sim-zone-id="resourceArea:${cssAttributeValue(event.playerId)}"]`,
  ]);
}

function findBySelectors(selectors: readonly string[]): HTMLElement | null {
  for (const selector of selectors) {
    if (!selector) {
      continue;
    }
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }
  return null;
}

function pulseImpact(entityId: string | undefined): void {
  if (!entityId) {
    return;
  }
  const target = findBySelectors([
    `[data-sim-entity-id="${cssAttributeValue(entityId)}"]`,
    `[data-card-id="${cssAttributeValue(entityId)}"]`,
  ]);
  if (!target) {
    return;
  }
  animateElement(
    target,
    [
      { filter: "brightness(1)", transform: "scale(1)" },
      { filter: "brightness(1.8)", transform: "scale(1.035)", offset: 0.35 },
      { filter: "brightness(1)", transform: "scale(1)" },
    ],
    { duration: 240, easing: "ease-out" },
  );
}

function animateElement(
  element: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: KeyframeAnimationOptions,
): void {
  if (typeof element.animate !== "function") {
    return;
  }
  element.animate(keyframes, options);
}

function boardCenter(): { x: number; y: number } {
  const board = document.querySelector<HTMLElement>(
    '[data-sim-board], [data-testid="board-wrap"], .board-bg',
  );
  const rect = board?.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function rectCenter(rect: DOMRect): { x: number; y: number } {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function formatPhaseLabel(value: string): string {
  if (!value) {
    return "";
  }
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function removeAfter(element: HTMLElement, durationMs: number, timers: Set<number>): Promise<void> {
  return new Promise((resolve) => {
    scheduleTimer(
      timers,
      () => {
        element.remove();
        resolve();
      },
      durationMs,
    );
  });
}

function scheduleTimer(timers: Set<number>, callback: () => void, delayMs: number): number {
  const timer = window.setTimeout(() => {
    if (!timers.has(timer)) {
      return;
    }
    timers.delete(timer);
    callback();
  }, delayMs);
  timers.add(timer);
  return timer;
}

function cssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\A ");
}
