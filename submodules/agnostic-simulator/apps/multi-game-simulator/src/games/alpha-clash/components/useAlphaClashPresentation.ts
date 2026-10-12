import { useCallback, useEffect, useRef, useState } from "react";
import type { DamageStrike } from "@tcg/simulator-presentation/effects";
import type { EngineInteractionView } from "@tcg/protocol";
import { type AnchorRect } from "./defeat-motion";
import type { LiveBoardState, LiveBoardProps } from "./board-types";

/** Maps confirmed, viewer-safe Alpha Clash changes to shared visual effects.
 * Drafts and outbound commands never create damage. New viewers and rewind
 * establish a baseline, without replaying departures from an old projection. */
export function useAlphaClashPresentation(board: LiveBoardState, view: EngineInteractionView) {
  const anchors = useRef(new Map<string, AnchorRect>());
  const previous = useRef<{
    version: number;
    actor: string;
    board: LiveBoardState;
    source?: string;
  } | null>(null);
  const sequence = useRef(0);
  const [strikes, setStrikes] = useState<DamageStrike[]>([]);
  const onSceneAnchors = useCallback<NonNullable<LiveBoardProps["onSceneAnchors"]>>((snapshot) => {
    for (const anchor of snapshot.cards) anchors.current.set(anchor.id, anchor);
  }, []);
  useEffect(() => {
    const before = previous.current;
    if (before?.version === view.stateVersion && before.actor === view.actorId) return;
    previous.current = {
      version: view.stateVersion,
      actor: view.actorId,
      board,
      source:
        view.status === "choosing"
          ? view.actions.find((action) => action.source)?.source?.instanceId
          : undefined,
    };
    if (!before || before.actor !== view.actorId || view.stateVersion <= before.version) {
      setStrikes([]);
      return;
    }
    const oldCards = new Map(before.board.cards.map((card) => [card.instanceId, card]));
    const visibleIds = new Set(board.cards.map((card) => card.instanceId));
    for (const id of anchors.current.keys()) if (!visibleIds.has(id)) anchors.current.delete(id);
    const origin = before.source ? anchors.current.get(before.source) : undefined;
    const lastDamage = before.board.damageEvents?.at(-1)?.sequence ?? 0;
    const amounts = new Map<string, number>();
    for (const event of board.damageEvents ?? []) {
      if (event.sequence > lastDamage)
        amounts.set(event.targetId, (amounts.get(event.targetId) ?? 0) + event.amount);
    }
    const targets = board.cards.flatMap((card) => {
      const old = oldCards.get(card.instanceId);
      const anchor = anchors.current.get(card.instanceId);
      if (!old || !anchor || card.faceDown || !card.definitionId) return [];
      const amount = board.damageEvents
        ? (amounts.get(card.instanceId) ?? 0)
        : card.clashDamage + card.phaseDamage - old.clashDamage - old.phaseDamage;
      return amount > 0
        ? [{ x: anchor.left + anchor.width / 2, y: anchor.top + anchor.height / 2, amount }]
        : [];
    });
    if (targets.length) {
      // Without an authoritative source, show local impacts rather than inventing an attacker.
      const impacts: DamageStrike[] = board.damageEvents
        ? [{ key: ++sequence.current, fromX: 0, fromY: 0, targets, localImpacts: true }]
        : origin
          ? [
              {
                key: ++sequence.current,
                fromX: origin.left + origin.width / 2,
                fromY: origin.top + origin.height / 2,
                targets,
              },
            ]
          : targets.map((target) => ({
              key: ++sequence.current,
              fromX: target.x,
              fromY: target.y,
              targets: [target],
            }));
      setStrikes((current) => [...current, ...impacts]);
    }
  }, [board, view]);
  return {
    strike: strikes[0] ?? null,
    busy: strikes.length > 0,
    onSceneAnchors,
    finishStrike: () => setStrikes((current) => current.slice(1)),
  };
}
