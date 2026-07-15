import { useMemo, useEffect, useLayoutEffect, useState } from "react";
import type { SimulatorTargetingIntent } from "@tcg/simulator-contract";
import { TargetingOverlay } from "@tcg/simulator-ui";

import { asMoveName, usePending, useBoardProjection } from "../../game/index.ts";
import type { DOMRectLike } from "../ui/types.ts";
import { findCardByInstanceId } from "./mappers.ts";

function toRectLike(r: DOMRect): DOMRectLike {
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  };
}

const GUNDAM_DIRECT_ZONE_ID = "gundam-direct-opp";
const GUNDAM_ZONE_SELECTOR = (zoneId: string) =>
  zoneId === GUNDAM_DIRECT_ZONE_ID ? '[data-direct-target="opp"]' : `[data-zone-id="${zoneId}"]`;
const EMPTY_CANDIDATE_IDS: readonly string[] = [];

export function measureRect(id: string): DOMRectLike | null {
  // `data-sim-entity-id`/`data-card-id` are rendered on the battle-area
  // CardFace, the CardHoverPreview (aria-hidden), and Comms-log CardLinks (<button>).
  // `querySelector` returns the first in DOM order — the sidebar log
  // precedes the board, so a naive query anchors the arrow to the log
  // link. Mirror `test/queries.ts → findCardsById`'s exclusions.
  // `CSS` isn't always present in jsdom — fall back to a manual escape,
  // matching `test/queries.ts → findCardsById`.
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(id)
      : id.replace(/["\\\n\r\f]/g, (ch) => `\\${ch}`);
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-sim-entity-id="${escaped}"], [data-card-id="${escaped}"]`,
  );
  for (const el of nodes) {
    if (el.closest("[aria-hidden='true']")) continue;
    if (el.closest("[role='log']")) continue;
    if (el.tagName === "BUTTON") continue;
    return toRectLike(el.getBoundingClientRect());
  }
  return null;
}

export function AttackTargetingOverlayContainer() {
  const pending = usePending();
  const view = useBoardProjection();
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  const [rects, setRects] = useState<Record<string, DOMRectLike>>({});

  const state = pending.state;
  const enterBattle = asMoveName("enterBattle");
  const isEnterBattleTargeting =
    state.status === "collecting" &&
    state.move === enterBattle &&
    state.steps[0]?.kind === "selectTarget" &&
    state.steps[0]?.role === "attackTarget";

  const attackerId =
    state.status === "collecting"
      ? (state.partialInput.attackerId as string | undefined)
      : undefined;

  const step =
    state.status === "collecting" && state.steps[0]?.kind === "selectTarget"
      ? state.steps[0]
      : null;
  const candidateIds: readonly string[] =
    isEnterBattleTargeting && step ? step.candidateIds : EMPTY_CANDIDATE_IDS;
  const candidateKey = candidateIds.join(",");

  useEffect(() => {
    setHoveredTargetId(null);
  }, [attackerId]);

  // The DIRECT_TARGET sentinel has no card on the board to anchor onto
  // — it represents an attack on the opponent player. We anchor it to
  // the opponent's PlayerSeatPlate (shields + base column), which is
  // tagged with `data-direct-target="opp"`.
  function measureDirectRect(): DOMRectLike | null {
    const el = document.querySelector<HTMLElement>('[data-direct-target="opp"]');
    return el ? toRectLike(el.getBoundingClientRect()) : null;
  }

  function buildRects(): Record<string, DOMRectLike> {
    if (!attackerId) return {};
    const next: Record<string, DOMRectLike> = {};
    const attackerRect = measureRect(attackerId);
    if (attackerRect) next[attackerId] = attackerRect;
    for (const id of candidateIds) {
      if (id === "direct") continue;
      const r = measureRect(id);
      if (r) next[id] = r;
    }
    if (candidateIds.includes("direct")) {
      const dr = measureDirectRect();
      if (dr) next["direct"] = dr;
    }
    return next;
  }

  useLayoutEffect(() => {
    if (!isEnterBattleTargeting || !attackerId) {
      setRects({});
      return;
    }
    setRects(buildRects());
  }, [isEnterBattleTargeting, attackerId, candidateKey]);

  useEffect(() => {
    if (!isEnterBattleTargeting) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") pending.cancel();
    }
    function onResize() {
      setRects(buildRects());
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isEnterBattleTargeting, attackerId, candidateKey, pending]);

  const attackerCard = attackerId ? findCardByInstanceId(view, attackerId) : null;
  const attackerDef = attackerCard?.definition as { name?: string; ap?: number } | null | undefined;
  const attackerRect = attackerId ? rects[attackerId] : undefined;
  const attackerDamage = typeof attackerDef?.ap === "number" ? attackerDef.ap : 0;

  const { targetRects, targetEntityIds, targetZoneIds } = useMemo(() => {
    const nextTargetRects: Record<string, DOMRectLike> = {};
    const nextTargetEntityIds: string[] = [];
    const nextTargetZoneIds: string[] = [];

    for (const id of candidateIds) {
      if (id === "direct") continue;
      const rect = rects[id];
      if (!rect) continue;
      nextTargetEntityIds.push(id);
      nextTargetRects[id] = rect;
    }

    // `direct` is a sentinel from `listLegalAttackTargets` (see
    // enter-battle.ts, `DIRECT_TARGET`). It's surfaced as a regular target
    // anchored to the opponent's PlayerSeatPlate — the player drags the
    // arrow over the opponent's shields/base column and clicks to commit,
    // matching the official Gundam digital UI.
    const directAvailable = candidateIds.includes("direct");
    const directRect = directAvailable ? rects["direct"] : undefined;
    if (directAvailable && directRect) {
      nextTargetZoneIds.push(GUNDAM_DIRECT_ZONE_ID);
      nextTargetRects["direct"] = directRect;
    }

    return {
      targetRects: nextTargetRects,
      targetEntityIds: nextTargetEntityIds,
      targetZoneIds: nextTargetZoneIds,
    };
  }, [candidateIds, rects]);

  const targetingIntents = useMemo<SimulatorTargetingIntent[]>(
    () => [
      {
        id: `gundam-attack-${attackerId ?? "pending"}`,
        sourceEntityId: attackerId ?? "",
        targetEntityIds,
        targetZoneIds,
        preview: { damage: attackerDamage },
      },
    ],
    [attackerDamage, attackerId, targetEntityIds, targetZoneIds],
  );

  if (!isEnterBattleTargeting || !attackerId) return null;
  if (!attackerCard || !attackerDef || !attackerRect) return null;
  if (targetEntityIds.length === 0 && targetZoneIds.length === 0) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[400] cursor-default bg-[rgba(26,37,66,.38)]"
        onClick={() => pending.cancel()}
      />
      <TargetingOverlay
        targetingIntents={targetingIntents}
        containerSelector=".board-bg"
        zoneSelector={GUNDAM_ZONE_SELECTOR}
        className="z-[403]"
      />
      {candidateIds.map((id) => {
        const r = targetRects[id];
        if (!r) return null;
        const pad = 6;
        const isHovered = hoveredTargetId === id;
        return (
          <div
            key={id}
            data-testid={`attack-target-${id}`}
            onMouseEnter={() => setHoveredTargetId(id)}
            onMouseLeave={() => setHoveredTargetId(null)}
            onClick={(e) => {
              e.stopPropagation();
              pending.provide("target", id);
            }}
            className="fixed z-[404] cursor-crosshair"
            style={{
              left: r.left - pad,
              top: r.top - pad,
              width: r.width + pad * 2,
              height: r.height + pad * 2,
              outline: isHovered ? "2px solid rgba(90,141,255,.75)" : undefined,
              outlineOffset: 2,
            }}
          />
        );
      })}
    </>
  );
}
