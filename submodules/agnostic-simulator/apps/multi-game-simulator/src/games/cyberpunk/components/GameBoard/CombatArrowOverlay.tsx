import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { getProjectedDirectAttackGigStealCount } from "@tcg/cyberpunk-engine";
import { TargetingArrow } from "@tcg/simulator-ui";
import { useCardView } from "../../engine/zoneViews";
import { PLAYER_SIDE_TO_ID, useEngine, type RawEngineEventEntry, type Side } from "../../engine";
import classes from "./CombatArrowOverlay.module.css";

interface CombatArrowOverlayProps {
  containerRef: RefObject<HTMLElement | null>;
}

interface Point {
  x: number;
  y: number;
}

interface CombatLine {
  segments: CombatSegment[];
}

interface CombatSegment {
  from: Point;
  to: Point;
  kind: "attack" | "block";
}

export function CombatArrowOverlay({ containerRef }: CombatArrowOverlayProps) {
  const { matchState, rawEngineEvents } = useEngine();
  const attack = matchState.G.attackState;
  const attacker = useCardView(attack?.attackerId as string | undefined);
  const blockerRedirect = useMemo(
    () => findLatestBlockerRedirect(attack, rawEngineEvents),
    [attack, rawEngineEvents],
  );
  const defenderId =
    attack?.redirectedByBlocker === true
      ? (blockerRedirect?.blockerId ?? attack.defenderId)
      : attack?.defenderId;
  const defender = useCardView(defenderId as string | undefined);
  const originalTarget = useCardView(blockerRedirect?.originalTarget ?? undefined);
  const [line, setLine] = useState<CombatLine | null>(null);
  const frameRef = useRef<number | null>(null);

  const shouldShow = Boolean(attack && attacker);
  const attackerPower = attacker?.effectivePower ?? 0;
  const defenderPower = defender?.effectivePower ?? 0;
  const isBlocked = attack?.redirectedByBlocker === true && Boolean(defenderId);
  const directStealCount = getProjectedDirectAttackGigStealCount(matchState);

  useLayoutEffect(() => {
    if (!shouldShow || !attack?.attackerId) {
      setLine(null);
      return;
    }

    const update = () => {
      const container = containerRef.current;
      if (!container) {
        setLine(null);
        return;
      }

      const attackerElement = findCardElement(attack.attackerId as string);
      const targetElement = findAttackTargetElement({
        attack,
        blockerRedirect,
      });
      const blockerElement = isBlocked && defenderId ? findCardElement(defenderId as string) : null;
      if (!attackerElement || !targetElement || (isBlocked && !blockerElement)) {
        setLine(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const attackerRect = attackerElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const attackerPoint = centerPoint(attackerRect, containerRect);
      const targetPoint = centerPoint(targetRect, containerRect);
      const segments: CombatSegment[] = [
        {
          from: attackerPoint,
          to: targetPoint,
          kind: "attack",
        },
      ];

      if (isBlocked && blockerElement) {
        const blockerPoint = centerPoint(blockerElement.getBoundingClientRect(), containerRect);
        segments.push({
          from: targetPoint,
          to: blockerPoint,
          kind: "block",
        });
      }

      setLine({
        segments,
      });
    };

    const schedule = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = window.requestAnimationFrame(update);
    };

    schedule();
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
      const attackerElement = findCardElement(attack.attackerId as string);
      const defenderElement = defenderId ? findCardElement(defenderId as string) : null;
      const targetElement = findAttackTargetElement({
        attack,
        blockerRedirect,
      });
      if (attackerElement) resizeObserver.observe(attackerElement);
      if (defenderElement) resizeObserver.observe(defenderElement);
      if (targetElement) resizeObserver.observe(targetElement);
    }
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [
    attack,
    attack?.attackerId,
    attack?.defenderId,
    attack?.kind,
    attack?.redirectedByBlocker,
    attack?.rivalId,
    blockerRedirect,
    containerRef,
    defenderId,
    isBlocked,
    shouldShow,
  ]);

  if (!shouldShow || !line || !attacker) {
    return null;
  }
  const activeAttack = attack;
  if (!activeAttack) {
    return null;
  }

  const stealPoint =
    !isBlocked && activeAttack.kind === "direct" && directStealCount !== null
      ? midpoint(line.segments[0])
      : null;
  const stealCue =
    stealPoint && directStealCount !== null ? { point: stealPoint, count: directStealCount } : null;
  const label = isBlocked
    ? `${attacker.name} attacks ${originalTarget?.name ?? "the player"}; ${defender?.name ?? "Blocker"} blocks`
    : defender
      ? `${attacker.name} attacks ${defender.name}: ${attackerPower} to ${defenderPower}`
      : directStealCount !== null
        ? `${attacker.name} attacks the player and would steal ${formatGigCount(directStealCount)} if unblocked`
        : `${attacker.name} attacks the player`;

  return (
    <div
      className={classes.overlay}
      data-testid="combat-arrow-overlay"
      data-active="true"
      data-attacker-id={String(activeAttack.attackerId)}
      data-defender-id={defenderId ? String(defenderId) : undefined}
      data-rival-id={activeAttack.rivalId ? String(activeAttack.rivalId) : undefined}
      data-kind={activeAttack.kind}
      data-step={activeAttack.step}
      data-blocked={isBlocked ? "true" : "false"}
      data-redirected-by-blocker={activeAttack.redirectedByBlocker ? "true" : "false"}
      aria-label={label}
    >
      <svg className={classes.svg} aria-hidden="true">
        {line.segments.map((segment, index) => (
          <ArrowSegment key={`${segment.kind}-${index}`} segment={segment} />
        ))}
      </svg>
      {stealCue ? (
        <div
          className={classes.stealCue}
          style={{ left: stealCue.point.x, top: stealCue.point.y }}
          data-testid="direct-attack-steal-cue"
          aria-label={`If unblocked, steal ${formatGigCount(stealCue.count)}`}
        >
          <span>Steal</span>
          <strong data-testid="direct-attack-steal-count">{stealCue.count}</strong>
        </div>
      ) : null}
    </div>
  );
}

function ArrowSegment({ segment }: { segment: CombatSegment }) {
  return (
    <TargetingArrow
      x1={segment.from.x}
      y1={segment.from.y}
      x2={segment.to.x}
      y2={segment.to.y}
      curved={false}
      animated
      color={segment.kind === "block" ? "#f5e642" : "#ff3d5e"}
    />
  );
}

function findLatestBlockerRedirect(
  attack: { defenderId?: unknown; redirectedByBlocker?: boolean } | null,
  rawEngineEvents: ReadonlyArray<RawEngineEventEntry>,
): { blockerId: string; originalTarget: string | null } | null {
  if (!attack?.redirectedByBlocker || !attack.defenderId) {
    return null;
  }

  const defenderId = cardIdString(attack.defenderId);
  if (!defenderId) {
    return null;
  }

  for (let i = rawEngineEvents.length - 1; i >= 0; i -= 1) {
    const entry = rawEngineEvents[i];
    if (!entry) continue;
    for (let j = entry.events.length - 1; j >= 0; j -= 1) {
      const event = entry.events[j];
      if (event?.type === "blockerActivated" && String(event.blockerId) === defenderId) {
        return {
          blockerId: String(event.blockerId),
          originalTarget: event.originalTarget ? String(event.originalTarget) : null,
        };
      }
    }
  }

  return null;
}

function findAttackTargetElement({
  attack,
  blockerRedirect,
}: {
  attack: {
    defenderId?: unknown;
    kind?: string;
    rivalId?: unknown;
  };
  blockerRedirect: { originalTarget: string | null } | null;
}): HTMLElement | null {
  if (blockerRedirect) {
    if (blockerRedirect.originalTarget) {
      return findCardElement(blockerRedirect.originalTarget);
    }
    return findPlayerTargetElement(sideForPlayerId(attack.rivalId));
  }

  if (attack.kind === "direct") {
    return findPlayerTargetElement(sideForPlayerId(attack.rivalId));
  }

  const defenderId = cardIdString(attack.defenderId);
  return defenderId ? findCardElement(defenderId) : null;
}

function cardIdString(cardId: unknown): string | null {
  return typeof cardId === "string" ? cardId : null;
}

function sideForPlayerId(playerId: unknown): Side | null {
  if (playerId === PLAYER_SIDE_TO_ID.player) {
    return "player";
  }
  if (playerId === PLAYER_SIDE_TO_ID.opponent) {
    return "opponent";
  }
  return null;
}

function findPlayerTargetElement(side: Side | null): HTMLElement | null {
  if (!side) {
    return null;
  }
  const dropZone = side === "opponent" ? "opp-pinfo" : "p-pinfo";
  const streetCredAnchor = side === "opponent" ? "opp-street-cred" : "p-street-cred";
  return (
    document.querySelector<HTMLElement>(`[data-sim-anchor-id="${streetCredAnchor}"]`) ??
    document.querySelector<HTMLElement>(`[data-testid="pinfo-zone"][data-side="${side}"]`) ??
    document.querySelector<HTMLElement>(`[data-drop-zone="${dropZone}"]`) ??
    document.querySelector<HTMLElement>(`[data-testid="gig-row"][data-side="${side}"]`) ??
    document.querySelector<HTMLElement>(`[data-testid="eddies-zone"][data-side="${side}"]`)
  );
}

function findCardElement(cardId: string): HTMLElement | null {
  const escapedId = cssEscape(cardId);
  return (
    document.querySelector<HTMLElement>(
      `[data-testid="field-unit"][data-card-id="${escapedId}"]`,
    ) ?? document.querySelector<HTMLElement>(`[data-testid="card"][data-card-id="${escapedId}"]`)
  );
}

function centerPoint(rect: DOMRect, container: DOMRect): Point {
  return {
    x: rect.left + rect.width / 2 - container.left,
    y: rect.top + rect.height / 2 - container.top,
  };
}

function midpoint(segment: CombatSegment | undefined): Point {
  if (!segment) return { x: 0, y: 0 };
  return {
    x: (segment.from.x + segment.to.x) / 2,
    y: (segment.from.y + segment.to.y) / 2,
  };
}

function formatGigCount(count: number): string {
  return `${count} Gig${count === 1 ? "" : "s"}`;
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && "escape" in CSS) {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
}
