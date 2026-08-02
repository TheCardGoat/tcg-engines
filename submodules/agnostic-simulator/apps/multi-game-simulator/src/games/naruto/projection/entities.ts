/**
 * CardInstance/CharacterInstance/SupportInstance -> SimulatorEntity projection.
 * Hidden information (opponent hand, opponent set supports, decks) is masked
 * here: `face: "hidden"`, generic title, no image. Every entity carries
 * `data-board-uid` so the AttackArrow can locate its DOM node.
 */

import {
  cardOf,
  chainLinkOf,
  characterHealth,
  effectivePower,
  leaderUid,
} from "@tcg-engines/naruto-engine";
import type {
  CardInstance,
  CharacterInstance,
  GameState,
  PlayerId,
  SupportInstance,
} from "@tcg-engines/naruto-engine";
import type { SimulatorEntity, SimulatorMetadataItem } from "@tcg/simulator-contract";

import { CARD_BACK_URL, cardImageUrl, cardName } from "./labels.ts";

function stat(label: string, value: string | number | null | undefined): SimulatorMetadataItem[] {
  return value === null || value === undefined ? [] : [{ label, value: String(value) }];
}

function hiddenEntity(
  id: string,
  ownerId: PlayerId,
  kind: SimulatorEntity["kind"],
): SimulatorEntity {
  return {
    id,
    title: "Hidden card",
    subtitle: "Hidden card",
    kind,
    ownerId,
    face: "hidden",
    states: ["hidden"],
    stats: [],
    traits: [],
    backImageUrl: CARD_BACK_URL,
    dataAttributes: { "data-board-uid": id },
  };
}

export function leaderEntity(state: GameState, owner: PlayerId): SimulatorEntity {
  const player = state.players[owner];
  const card = cardOf({ uid: leaderUid(owner), cardId: player.leaderId });
  const id = leaderUid(owner);
  return {
    id,
    title: card?.nameEn ?? player.leaderId,
    subtitle: "Leader",
    kind: "leader",
    ownerId: owner,
    face: "public",
    states: player.leaderRested ? ["rested"] : ["ready"],
    stats: [...stat("Life", player.life), ...stat("Power", card?.power)],
    traits: [...(card?.traits ?? [])],
    imageUrl: cardImageUrl(player.leaderId),
    dataAttributes: {
      "data-board-uid": id,
      "data-life": player.life,
      "data-rested": player.leaderRested,
      "data-power": card?.power ?? 0,
    },
  };
}

export function characterEntity(
  state: GameState,
  owner: PlayerId,
  character: CharacterInstance,
  slotIndex: number,
): SimulatorEntity {
  const card = cardOf(character);
  const power = effectivePower(character, state.turn);
  const health = characterHealth(character);
  const chainLink = chainLinkOf(state, character.uid);
  const doubled = character.powerDoubledUntilTurn >= state.turn;
  const badges: NonNullable<SimulatorEntity["overlayBadges"]> = [];
  if (character.damage > 0) {
    badges.push({ label: `-${character.damage}`, color: "#a33636", position: "tr" });
  }
  if (character.powerBonus > 0) {
    badges.push({ label: `+${character.powerBonus}`, color: "#2e7d32", position: "tl" });
  }
  if (chainLink !== null) {
    badges.push({ label: `#${chainLink}`, color: "#eb6101", position: "bl" });
  }
  return {
    id: character.uid,
    title: cardName(character.cardId),
    subtitle: card?.cardType === "ex_character" ? "EX Character" : "Character",
    kind: "character",
    ownerId: owner,
    face: "public",
    states: character.rested ? ["rested"] : ["ready"],
    stats: [
      ...stat("Power", power),
      ...stat("Damage", character.damage > 0 ? character.damage : null),
      ...stat("Health", health),
    ],
    traits: [...(card?.traits ?? [])],
    imageUrl: cardImageUrl(character.cardId),
    overlayBadges: badges.length > 0 ? badges : undefined,
    frameStyle: doubled ? { color: "#eb6101", pattern: "doubled" } : undefined,
    dataAttributes: {
      "data-board-uid": character.uid,
      "data-slot-index": slotIndex,
      "data-power": power,
      "data-damage": character.damage,
      "data-rested": character.rested,
      "data-doubled": doubled,
      "data-chain": chainLink ?? undefined,
    },
  };
}

export function supportEntity(
  state: GameState,
  owner: PlayerId,
  support: SupportInstance,
  slotIndex: number,
  viewer: PlayerId,
): SimulatorEntity {
  const revealed = support.revealed === true;
  const visible = revealed || owner === viewer;
  if (!visible) {
    const hidden = hiddenEntity(support.uid, owner, "card");
    hidden.subtitle = "Set support";
    hidden.dataAttributes = {
      ...hidden.dataAttributes,
      "data-slot-index": slotIndex,
      "data-support": true,
    };
    return hidden;
  }
  const card = cardOf(support);
  const chainLink = chainLinkOf(state, support.uid);
  return {
    id: support.uid,
    title: card?.support?.name ?? cardName(support.cardId),
    subtitle: revealed ? `Support (link ${chainLink ?? "-"})` : "Set support",
    kind: "card",
    ownerId: owner,
    face: "public",
    states: revealed ? ["active"] : ["hidden"],
    stats: stat("Cost", card?.support?.cost),
    traits: [...(card?.traits ?? [])],
    imageUrl: cardImageUrl(support.cardId),
    backImageUrl: CARD_BACK_URL,
    overlayBadges:
      chainLink !== null
        ? [{ label: `#${chainLink}`, color: "#eb6101", position: "bl" }]
        : undefined,
    dataAttributes: {
      "data-board-uid": support.uid,
      "data-slot-index": slotIndex,
      "data-support": true,
      "data-revealed": revealed,
      "data-chain": chainLink ?? undefined,
    },
  };
}

export function handCardEntity(
  owner: PlayerId,
  instance: CardInstance,
  viewer: PlayerId,
): SimulatorEntity {
  if (owner !== viewer) {
    const hidden = hiddenEntity(instance.uid, owner, "card");
    hidden.subtitle = "Hand";
    return hidden;
  }
  const card = cardOf(instance);
  const typeLabel =
    card?.cardType === "ex_character"
      ? "EX Character"
      : card?.cardType === "character"
        ? "Character"
        : card?.support
          ? "Support"
          : "Card";
  return {
    id: instance.uid,
    title: cardName(instance.cardId),
    subtitle: typeLabel,
    kind: "card",
    ownerId: owner,
    face: "public",
    states: ["ready"],
    stats: [
      ...stat("Power", card?.power),
      ...stat("Damage", card?.damage),
      ...stat("Health", card?.health),
    ],
    traits: [...(card?.traits ?? [])],
    imageUrl: cardImageUrl(instance.cardId),
    backImageUrl: CARD_BACK_URL,
    dataAttributes: { "data-board-uid": instance.uid, "data-hand": true },
  };
}

export function trashCardEntity(owner: PlayerId, instance: CardInstance): SimulatorEntity {
  const card = cardOf(instance);
  return {
    id: instance.uid,
    title: cardName(instance.cardId),
    subtitle: "Trash",
    kind: "card",
    ownerId: owner,
    face: "public",
    states: ["ready"],
    stats: [...stat("Power", card?.power), ...stat("Health", card?.health)],
    traits: [...(card?.traits ?? [])],
    imageUrl: cardImageUrl(instance.cardId),
    dataAttributes: { "data-board-uid": instance.uid },
  };
}

/** Flat entity list for the whole state (both seats, viewer-masked). */
export function projectEntities(state: GameState, viewer: PlayerId): SimulatorEntity[] {
  const entities: SimulatorEntity[] = [];
  for (const owner of ["p1", "p2"] as const) {
    const player = state.players[owner];
    entities.push(leaderEntity(state, owner));
    player.characters.forEach((character, index) => {
      if (character) entities.push(characterEntity(state, owner, character, index));
    });
    player.supports.forEach((support, index) => {
      if (support) entities.push(supportEntity(state, owner, support, index, viewer));
    });
    for (const instance of player.hand) {
      entities.push(handCardEntity(owner, instance, viewer));
    }
    const topTrash = player.trash[player.trash.length - 1];
    if (topTrash) entities.push(trashCardEntity(owner, topTrash));
  }
  return entities;
}
