import { useEffect, useLayoutEffect, useState } from "react";

import { asMoveName, usePending, useBoardProjection } from "../../game/index.ts";
import { AttackTargetingOverlay } from "../ui/AttackTargetingOverlay.tsx";
import type { AttackAttacker, AttackTarget, DOMRectLike } from "../ui/types.ts";
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

export function measureRect(id: string): DOMRectLike | null {
  // `data-card-id` is rendered on the battle-area CardFace, the
  // CardHoverPreview (aria-hidden), and Comms-log CardLinks (<button>).
  // `querySelector` returns the first in DOM order — the sidebar log
  // precedes the board, so a naive query anchors the arrow to the log
  // link. Mirror `test/queries.ts → findCardsById`'s exclusions.
  // `CSS` isn't always present in jsdom — fall back to a manual escape,
  // matching `test/queries.ts → findCardsById`.
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(id)
      : id.replace(/["\\\n\r\f]/g, (ch) => `\\${ch}`);
  const nodes = document.querySelectorAll<HTMLElement>(`[data-card-id="${escaped}"]`);
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
  const candidateIds = isEnterBattleTargeting && step ? step.candidateIds : [];
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
    function onResize() {
      setRects(buildRects());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isEnterBattleTargeting, attackerId, candidateKey]);

  if (!isEnterBattleTargeting || !attackerId) return null;

  const attackerCard = findCardByInstanceId(view, attackerId);
  const attackerDef = attackerCard?.definition as { name?: string; ap?: number } | null | undefined;
  const attackerRect = rects[attackerId];
  if (!attackerCard || !attackerDef || !attackerRect) return null;

  const attacker: AttackAttacker = {
    id: attackerId,
    name: attackerDef.name ?? "Unit",
    strength: typeof attackerDef.ap === "number" ? attackerDef.ap : 0,
  };

  const targets: AttackTarget[] = [];
  const targetRects: Record<string, DOMRectLike> = {};
  for (const id of candidateIds) {
    if (id === "direct") continue;
    const rect = rects[id];
    if (!rect) continue;
    const card = findCardByInstanceId(view, id);
    const def = card?.definition as { name?: string; hp?: number } | null | undefined;
    targets.push({
      id,
      name: def?.name ?? "Unit",
      willpower: typeof def?.hp === "number" ? def.hp : 0,
    });
    targetRects[id] = rect;
  }

  // `direct` is a sentinel from `listLegalAttackTargets` (see
  // enter-battle.ts, `DIRECT_TARGET`). It's surfaced as a regular target
  // anchored to the opponent's PlayerSeatPlate — the player drags the
  // arrow over the opponent's shields/base column and clicks to commit,
  // matching the official Gundam digital UI.
  const directAvailable = candidateIds.includes("direct");
  const directRect = directAvailable ? rects["direct"] : undefined;
  if (directAvailable && directRect) {
    // `name` is unused for `isDirect` targets — DirectBadge renders the
    // localized label and there's no defender card to surface. Empty
    // string avoids leaking an English literal if the value is read later.
    targets.push({ id: "direct", name: "", willpower: 0, isDirect: true });
    targetRects["direct"] = directRect;
  }

  if (targets.length === 0) return null;

  const hoveredTarget = hoveredTargetId
    ? (targets.find((t) => t.id === hoveredTargetId) ?? null)
    : null;

  return (
    <AttackTargetingOverlay
      attacker={attacker}
      attackerRect={attackerRect}
      targets={targets}
      targetRects={targetRects}
      hoveredTargetId={hoveredTargetId ?? undefined}
      hoveredTarget={hoveredTarget}
      onTargetHover={setHoveredTargetId}
      onConfirm={(targetId) => pending.provide("target", targetId)}
      onCancel={() => pending.cancel()}
    />
  );
}
