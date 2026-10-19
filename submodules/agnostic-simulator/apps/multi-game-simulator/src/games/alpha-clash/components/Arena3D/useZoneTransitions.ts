import { LOCAL_DAMAGE_READ_MS } from "@tcg/simulator-presentation/effects";
import { useEffect, useMemo, useState } from "react";
import type { LiveBoardCard, LiveBoardState } from "../board-types";
import type { PlacedCard } from "./layout";
import type { ArenaZone } from "./zones";

/** Retain the existing mesh until it reaches a pile or a collapsed zone. */
export function departingPlacements(
  previous: readonly PlacedCard[],
  current: readonly PlacedCard[],
  board: readonly LiveBoardCard[],
  zones: readonly ArenaZone[],
  horizontalScale: number,
): PlacedCard[] {
  const visible = new Set(current.map(({ card }) => card.instanceId));
  return previous.flatMap((placed) => {
    if (visible.has(placed.card.instanceId)) return [];
    const card = board.find((entry) => entry.instanceId === placed.card.instanceId);
    if (!card || card.zone === placed.card.zone) return [];
    const zone = zones.find((entry) => entry.seat === card.controller && entry.zone === card.zone);
    if (!zone) return [];
    return [
      {
        card,
        x: zone.x * (zone.scaleX ? horizontalScale : 1),
        y: zone.y,
        z: 18,
        height: 70,
        angle: 0,
        hand: false,
        departing: true,
      },
    ];
  });
}

export function useZoneTransitions(
  current: PlacedCard[],
  board: readonly LiveBoardCard[],
  zones: readonly ArenaZone[],
  viewer: string,
  horizontalScale: number,
  reduced: boolean,
  damageEvents?: LiveBoardState["damageEvents"],
) {
  const damageSequence = damageEvents?.at(-1)?.sequence ?? 0;
  const [saved, setSaved] = useState({
    current,
    viewer,
    exits: [] as PlacedCard[],
    holds: [] as PlacedCard[],
    damageSequence,
    impactDone: true,
  });
  let state = saved;
  if (
    saved.current !== current ||
    saved.viewer !== viewer ||
    saved.damageSequence !== damageSequence ||
    (reduced && (saved.exits.length || saved.holds.length))
  ) {
    const exits =
      reduced || saved.viewer !== viewer
        ? []
        : [
            ...saved.exits.filter(
              (exit) =>
                !current.some(({ card }) => card.instanceId === exit.card.instanceId) &&
                board.some(
                  (card) =>
                    card.instanceId === exit.card.instanceId && card.zone === exit.card.zone,
                ),
            ),
            ...departingPlacements(saved.current, current, board, zones, horizontalScale),
          ];
    state = {
      current,
      viewer,
      exits: [...new Map(exits.map((exit) => [exit.card.instanceId, exit])).values()],
      damageSequence,
      impactDone: damageSequence > saved.damageSequence ? false : saved.impactDone,
      holds:
        reduced || saved.viewer !== viewer || damageSequence < saved.damageSequence
          ? []
          : damageSequence > saved.damageSequence
            ? saved.current.filter((placed) =>
                board.some(
                  (card) =>
                    placed.card.zone === "clash" &&
                    card.instanceId === placed.card.instanceId &&
                    !card.faceDown &&
                    card.definitionId,
                ),
              )
            : saved.holds,
    };
    setSaved(state);
  }
  useEffect(() => {
    if (!saved.holds.length || saved.impactDone) return;
    const timer = setTimeout(
      () => setSaved((value) => ({ ...value, impactDone: true })),
      LOCAL_DAMAGE_READ_MS,
    );
    return () => clearTimeout(timer);
  }, [saved.damageSequence, saved.holds, saved.impactDone]);
  const cards = useMemo(
    () =>
      [...current, ...state.exits].map((placed) => {
        const held = state.holds.find((entry) => entry.card.instanceId === placed.card.instanceId);
        // Read damage first, then clear defeated cards, then close the gaps.
        const hold = held && (!state.impactDone || (!placed.departing && state.exits.length > 0));
        return hold
          ? {
              ...held,
              card: { ...placed.card, zone: held.card.zone, ready: held.card.ready },
              departing: false,
            }
          : placed;
      }),
    [current, state.exits, state.holds, state.impactDone],
  );
  return {
    cards,
    arrived: (id: string, zone: string) =>
      setSaved((value) => ({
        ...value,
        exits: value.exits.filter((exit) => exit.card.instanceId !== id || exit.card.zone !== zone),
      })),
  };
}
