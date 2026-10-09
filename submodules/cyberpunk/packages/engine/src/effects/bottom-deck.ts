import type { CardZone } from "@tcg/cyberpunk-types";
import type { Operations } from "../operations/index.ts";
import { SeededRNG } from "../state/rng.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";
import type { MatchState } from "../types/match-state.ts";
import { removeFromGameIfLegendMovesToInvalidArea } from "../moves/remove-from-game.ts";

/**
 * Bottom-deck every targeted card and any Gear still attached to those cards
 * as one randomized batch per owner (CR 11.12.1 / 11.12.1.3 / 4.12.3).
 */
export function bottomDeckCardsSimultaneously(
  targetIds: readonly CardInstanceId[],
  state: MatchState,
  ops: Operations,
): void {
  const targetSet = new Set(targetIds.map((id) => id as string));

  for (const id of targetIds) {
    const card = state.G.cardIndex[id as string];
    if (!card?.meta.attachedToId) continue;
    if (targetSet.has(card.meta.attachedToId as string)) continue;
    ops.card.detachGear(id);
  }

  const consumed = new Set<string>();
  const groups: CardInstanceId[][] = [];
  for (const id of targetIds) {
    if (consumed.has(id as string)) continue;
    const card = state.G.cardIndex[id as string];
    if (!card) continue;
    if (card.meta.attachedToId && targetSet.has(card.meta.attachedToId as string)) {
      continue;
    }
    const group: CardInstanceId[] = [id, ...card.meta.attachedGearIds];
    for (const movedId of group) consumed.add(movedId as string);
    groups.push(group);
  }

  const byOwner = new Map<PlayerId, CardInstanceId[]>();
  for (const group of groups) {
    for (const movedId of group) {
      const moved = state.G.cardIndex[movedId as string];
      if (!moved) continue;
      const batch = byOwner.get(moved.ownerId) ?? [];
      batch.push(movedId);
      byOwner.set(moved.ownerId, batch);
    }
  }

  const rng = new SeededRNG(state.ctx.seed);
  if (state.ctx.rngState) rng.setState(state.ctx.rngState);

  for (const [owner, ids] of byOwner) {
    const shuffled = rng.shuffle(ids);
    placeOnBottom(owner, shuffled, state, ops);
  }

  for (const group of groups) {
    const hostId = group[0];
    if (hostId) removeFromGameIfLegendMovesToInvalidArea(state, ops, hostId);
  }

  state.ctx.rngState = rng.getState();
}

function placeOnBottom(
  owner: PlayerId,
  ids: readonly CardInstanceId[],
  state: MatchState,
  ops: Operations,
): void {
  const player = state.G.players[owner as string];
  const fromZones = new Map<string, CardZone>();
  if (player) {
    for (const movedId of ids) {
      const movedCard = state.G.cardIndex[movedId as string];
      if (!movedCard) continue;
      fromZones.set(movedId as string, movedCard.zone);
      const fromList = player.zones[movedCard.zone];
      const idx = fromList.indexOf(movedId);
      if (idx !== -1) fromList.splice(idx, 1);
    }
  }

  ops.zone.moveCardsToBottom(owner, [...ids]);

  for (const movedId of ids) {
    const movedCard = state.G.cardIndex[movedId as string];
    if (!movedCard) continue;
    const fromZone = fromZones.get(movedId as string) ?? movedCard.zone;
    movedCard.zone = "deck";
    // CR 4.12.1: Gear follows its host once, but is not equipped in the deck.
    movedCard.meta = createDefaultMetaForZone("deck");
    ops.event.emit({
      type: "cardMoved",
      cardId: movedId,
      fromZone,
      toZone: "deck",
      deckPlacement: "bottom",
      playerId: owner,
    });
  }
}
