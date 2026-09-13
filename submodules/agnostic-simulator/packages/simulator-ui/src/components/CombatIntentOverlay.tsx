import { useLayoutEffect, useRef, useState } from "react";
import type { SimulatorCombatEndpoint, SimulatorCombatIntent } from "@tcg/simulator-contract";

import { TargetingArrow, type TargetingArrowVariant } from "./TargetingArrow";

interface Point {
  readonly x: number;
  readonly y: number;
}

interface RouteSegment {
  readonly from: Point;
  readonly to: Point;
  readonly role: "attack" | "redirect";
  readonly variant: TargetingArrowVariant;
  readonly label: string;
}

interface RouteGeometry {
  readonly segments: readonly RouteSegment[];
  readonly labelObstacles: readonly { left: number; right: number; top: number; bottom: number }[];
  readonly width: number;
  readonly height: number;
  readonly scrollLeft: number;
  readonly scrollTop: number;
  readonly fallback: boolean;
}

export interface CombatIntentOverlayProps {
  readonly intent: SimulatorCombatIntent | null;
  readonly containerSelector?: string;
  readonly entitySelector?: (entityId: string) => string;
  readonly zoneSelector?: (zoneId: string) => string;
  readonly playerSelector?: (playerId: string) => string;
  readonly className?: string;
  /** Board UI whose bounds must remain clear of combat labels. */
  readonly labelAvoidSelector?: string;
}

const cssEscape = (value: string) =>
  typeof CSS !== "undefined" && typeof CSS.escape === "function"
    ? CSS.escape(value)
    : value.replace(/["\\\n\r\f]/g, (character) => `\\${character}`);

const defaultEntitySelector = (id: string) => `[data-sim-entity-id="${cssEscape(id)}"]`;
const defaultZoneSelector = (id: string) => `[data-zone-id="${cssEscape(id)}"]`;
const defaultPlayerSelector = (id: string) => `[data-sim-player-id="${cssEscape(id)}"]`;

/** Persistent, game-agnostic combat route derived from live projected state. */
export function CombatIntentOverlay({
  intent,
  containerSelector = ".board-mat",
  entitySelector = defaultEntitySelector,
  zoneSelector = defaultZoneSelector,
  playerSelector = defaultPlayerSelector,
  className,
  labelAvoidSelector,
}: CombatIntentOverlayProps) {
  const [geometry, setGeometry] = useState<RouteGeometry | null>(null);
  const frameRef = useRef<number | null>(null);
  const intentRef = useRef(intent);
  const geometryKey = combatGeometryKey(intent);

  useLayoutEffect(() => {
    intentRef.current = intent;
  });

  useLayoutEffect(() => {
    if (!intentRef.current) {
      setGeometry(null);
      return;
    }

    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) {
      setGeometry(null);
      return;
    }

    const resolveEndpoint = (endpoint: SimulatorCombatEndpoint): HTMLElement | null => {
      const selector =
        endpoint.kind === "entity"
          ? entitySelector(endpoint.id)
          : endpoint.kind === "zone"
            ? zoneSelector(endpoint.id)
            : playerSelector(endpoint.id);
      return container.querySelector<HTMLElement>(selector) ?? document.querySelector(selector);
    };

    const observedElements = new WeakSet<Element>();
    let resizeObserver: ResizeObserver | null = null;

    const observeGeometryElement = (element: Element | null) => {
      if (!element || observedElements.has(element)) return;
      observedElements.add(element);
      resizeObserver?.observe(element);
    };

    const update = () => {
      const currentIntent = intentRef.current;
      if (!currentIntent) {
        setGeometry(null);
        return;
      }
      const attackerElement = resolveEndpoint({
        kind: "entity",
        id: currentIntent.attackerEntityId,
      });
      const declaredTargetElement = resolveEndpoint(currentIntent.declaredTarget);
      const currentTargetElement = resolveEndpoint(currentIntent.currentTarget);
      observeGeometryElement(attackerElement);
      observeGeometryElement(declaredTargetElement);
      observeGeometryElement(currentTargetElement);

      const attacker = attackerElement?.getBoundingClientRect();
      const declaredTarget = declaredTargetElement?.getBoundingClientRect();
      const currentTarget = currentTargetElement?.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const labelObstacles = labelAvoidSelector
        ? Array.from(document.querySelectorAll<HTMLElement>(labelAvoidSelector), (element) => {
            observeGeometryElement(element);
            const rect = element.getBoundingClientRect();
            return {
              left: rect.left - containerRect.left,
              right: rect.right - containerRect.left,
              top: rect.top - containerRect.top,
              bottom: rect.bottom - containerRect.top,
            };
          })
        : [];
      if (!attacker || (!declaredTarget && !currentTarget)) {
        setGeometry(null);
        return;
      }

      const attackerPoint = centerPoint(attacker, containerRect);
      const declaredTargetPoint = declaredTarget
        ? centerPoint(declaredTarget, containerRect)
        : null;
      const currentTargetPoint = currentTarget ? centerPoint(currentTarget, containerRect) : null;
      const redirected =
        currentIntent.phase === "redirected" &&
        !sameEndpoint(currentIntent.declaredTarget, currentIntent.currentTarget);
      const segments: RouteSegment[] = [];

      if (declaredTargetPoint) {
        segments.push({
          from: attackerPoint,
          to: declaredTargetPoint,
          role: "attack",
          variant: redirected ? "history" : "attack",
          label:
            currentIntent.declaredTargetLabel ??
            (redirected ? "Original target, protected" : "Attack target"),
        });
      }

      if (redirected && currentTargetPoint) {
        segments.push({
          from: attackerPoint,
          to: currentTargetPoint,
          role: "redirect",
          variant: "redirect",
          label: currentIntent.currentTargetLabel ?? "Redirected target",
        });
      } else if (!declaredTargetPoint && currentTargetPoint) {
        segments.push({
          from: attackerPoint,
          to: currentTargetPoint,
          role: "attack",
          variant: "attack",
          label: currentIntent.currentTargetLabel ?? "Current target",
        });
      }

      setGeometry({
        segments,
        labelObstacles,
        width: containerRect.width,
        height: containerRect.height,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
        fallback: !declaredTargetPoint && Boolean(currentTargetPoint),
      });
    };

    const schedule = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };

    resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observeGeometryElement(container);
    const mutationObserver =
      typeof MutationObserver === "undefined" ? null : new MutationObserver(schedule);
    mutationObserver?.observe(container, { childList: true, subtree: true });
    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [
    containerSelector,
    entitySelector,
    geometryKey,
    labelAvoidSelector,
    playerSelector,
    zoneSelector,
  ]);

  if (!intent) return null;
  const labelPlacements = geometry ? placeCombatLabels(geometry, intent.attackKind) : [];

  return (
    <>
      {intent.ariaLabel ? (
        <span className="sr-only" role="status" aria-live="polite">
          {intent.ariaLabel}
        </span>
      ) : null}
      {geometry && geometry.segments.length > 0 ? (
        <div
          className={`combat-intent-overlay pointer-events-none absolute inset-0${className ? ` ${className}` : ""}`}
          // This component is consumed from a workspace outside the app's
          // Tailwind source scan. Keep the combat route above the match rail
          // even when that host does not generate the arbitrary z-index utility.
          style={{
            zIndex: 402,
            transform: `translate(${geometry.scrollLeft}px, ${geometry.scrollTop}px)`,
          }}
          data-testid="combat-intent-overlay"
          data-combat-intent-id={intent.id}
          data-combat-phase={intent.phase}
          data-attack-kind={intent.attackKind}
          data-attacker-ref={`entity:${intent.attackerEntityId}`}
          data-original-target-ref={endpointKey(intent.declaredTarget)}
          data-active-target-ref={endpointKey(intent.currentTarget)}
          data-route-fallback={geometry.fallback ? "true" : "false"}
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 overflow-visible"
            width={geometry.width}
            height={geometry.height}
          >
            {geometry.segments.map((segment) => (
              <g
                key={`${intent.id}:${segment.role}`}
                data-testid={`combat-intent-${segment.role}-segment`}
                data-combat-segment-role={segment.role}
              >
                <TargetingArrow
                  x1={segment.from.x}
                  y1={segment.from.y}
                  x2={segment.to.x}
                  y2={segment.to.y}
                  curved={false}
                  animated
                  variant={segment.variant}
                  color={
                    segment.role === "redirect"
                      ? "var(--combat-redirect-color, #f5e642)"
                      : segment.variant === "history"
                        ? "var(--combat-history-color, #a8b1c2)"
                        : "var(--combat-attack-color, #ff3d5e)"
                  }
                />
              </g>
            ))}
          </svg>
          {labelPlacements.map(({ segment, point, labelY }) => {
            return (
              <span
                key={`${segment.role}:label`}
                className={`absolute max-w-[min(12rem,calc(100%-1rem))] -translate-x-1/2 -translate-y-1/2 truncate rounded-full border bg-[#080d18]/95 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] shadow-lg ${
                  segment.role === "redirect"
                    ? "border-[#f5e642]/80 text-[#fff4a8]"
                    : segment.variant === "history"
                      ? "border-[#a8b1c2]/55 text-[#d8deea]"
                      : "border-[#ff3d5e]/80 text-[#ffd7df]"
                }`}
                data-testid={`combat-intent-${segment.role}-label`}
                style={{ left: point.x, top: labelY }}
              >
                {segment.label}
              </span>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

function placeCombatLabels(
  geometry: RouteGeometry,
  attackKind: SimulatorCombatIntent["attackKind"],
): Array<{ segment: RouteSegment; point: Point; labelY: number }> {
  const placed: Array<{
    segment: RouteSegment;
    point: Point;
    labelY: number;
    halfWidth: number;
  }> = [];

  for (const segment of geometry.segments) {
    const initialPoint = badgePoint(segment, geometry.width, geometry.height, attackKind);
    const halfWidth = combatLabelHalfWidth(segment.label);
    let point = initialPoint;
    let labelY = clearLabelY(point, geometry.labelObstacles, geometry.height);

    const collidingLabel = placed.find((candidate) =>
      combatLabelsOverlap(point.x, labelY, halfWidth, candidate),
    );
    if (collidingLabel) {
      const separation = collidingLabel.halfWidth + halfWidth + 8;
      const horizontalCandidates = [
        collidingLabel.point.x + separation,
        collidingLabel.point.x - separation,
      ]
        .filter((x) => x >= halfWidth && x <= geometry.width - halfWidth)
        .sort((left, right) => Math.abs(left - initialPoint.x) - Math.abs(right - initialPoint.x));
      const clearX = horizontalCandidates.find((x) => {
        const candidateY = clearLabelY(
          { x, y: initialPoint.y },
          geometry.labelObstacles,
          geometry.height,
        );
        return !placed.some((candidate) =>
          combatLabelsOverlap(x, candidateY, halfWidth, candidate),
        );
      });

      if (clearX !== undefined) {
        point = { ...point, x: clearX };
        labelY = clearLabelY(point, geometry.labelObstacles, geometry.height);
      } else {
        const placedObstacles = placed.map((candidate) => ({
          left: candidate.point.x - candidate.halfWidth,
          right: candidate.point.x + candidate.halfWidth,
          top: candidate.labelY - 22,
          bottom: candidate.labelY + 22,
        }));
        labelY = clearLabelY(
          point,
          [...geometry.labelObstacles, ...placedObstacles],
          geometry.height,
        );
      }
    }

    placed.push({ segment, point, labelY, halfWidth });
  }

  return placed;
}

function combatLabelHalfWidth(label: string): number {
  return Math.min(96, Math.max(24, (label.length * 7 + 20) / 2));
}

function combatLabelsOverlap(
  x: number,
  y: number,
  halfWidth: number,
  other: { point: Point; labelY: number; halfWidth: number },
): boolean {
  return (
    Math.abs(x - other.point.x) < halfWidth + other.halfWidth + 8 && Math.abs(y - other.labelY) < 44
  );
}

function clearLabelY(
  point: Point,
  obstacles: RouteGeometry["labelObstacles"],
  height: number,
): number {
  const verticalPadding = 22;
  const relevantIntervals = obstacles
    .filter((obstacle) => point.x + 96 > obstacle.left && point.x - 96 < obstacle.right)
    .map((obstacle) => ({
      top: obstacle.top - verticalPadding,
      bottom: obstacle.bottom + verticalPadding,
    }))
    .sort((left, right) => left.top - right.top);
  const mergedIntervals: Array<{ top: number; bottom: number }> = [];

  for (const interval of relevantIntervals) {
    const previous = mergedIntervals.at(-1);
    if (previous && interval.top <= previous.bottom) {
      previous.bottom = Math.max(previous.bottom, interval.bottom);
    } else {
      mergedIntervals.push({ ...interval });
    }
  }

  for (const interval of mergedIntervals) {
    if (point.y < interval.top || point.y > interval.bottom) continue;
    const above = clamp(interval.top, 0, height);
    const below = clamp(interval.bottom, 0, height);
    return Math.abs(point.y - above) <= Math.abs(point.y - below) ? above : below;
  }

  return point.y;
}

function centerPoint(rect: DOMRect, container: DOMRect): Point {
  return {
    x: rect.left + rect.width / 2 - container.left,
    y: rect.top + rect.height / 2 - container.top,
  };
}

function badgePoint(
  segment: RouteSegment,
  width: number,
  height: number,
  attackKind: SimulatorCombatIntent["attackKind"],
): Point {
  const compact = width < 520;
  const progress = segment.role === "redirect" ? 0.72 : 0.68;
  const verticalOffset =
    segment.role === "redirect" ? 12 : compact ? (attackKind === "direct" ? -64 : -42) : -18;
  const horizontalInset = compact
    ? Math.min(segment.role === "redirect" ? 170 : 104, width / 2)
    : 58;
  const verticalInset = Math.min(18, height / 2);
  return {
    x: clamp(
      segment.from.x + (segment.to.x - segment.from.x) * progress,
      horizontalInset,
      width - horizontalInset,
    ),
    y: clamp(
      segment.from.y + (segment.to.y - segment.from.y) * progress + verticalOffset,
      verticalInset,
      height - verticalInset,
    ),
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function sameEndpoint(left: SimulatorCombatEndpoint, right: SimulatorCombatEndpoint): boolean {
  return left.kind === right.kind && left.id === right.id;
}

function endpointKey(endpoint: SimulatorCombatEndpoint): string {
  return `${endpoint.kind}:${endpoint.id}`;
}

function combatGeometryKey(intent: SimulatorCombatIntent | null): string {
  if (!intent) return "";
  return [
    intent.attackerEntityId,
    endpointKey(intent.declaredTarget),
    endpointKey(intent.currentTarget),
    intent.phase,
    intent.declaredTargetLabel ?? "",
    intent.currentTargetLabel ?? "",
  ].join("|");
}
