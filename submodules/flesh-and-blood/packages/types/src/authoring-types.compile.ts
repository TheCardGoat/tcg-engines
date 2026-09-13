/**
 * Compile-fail contract for authorable encodings. `tsc --noEmit` in this
 * package is the test: derived-fact slugs, type-box name phrases, and
 * lookThen without outputBinding must not typecheck.
 */
import type { FabAuthorableHasStatusCondition } from "./status-markers.ts";
import type { FabPlayModification } from "./abilities/ability.ts";
import type { FabEffect } from "./abilities/effect.ts";
import type { FabZone } from "./abilities/primitives.ts";
import {
  bindingMatches,
  compareAmount,
  lookThen,
  namedCard,
  performedThisTurn,
  zoneCount,
} from "./abilities/authoring.ts";
import { defineFleshAndBloodCard } from "./card.ts";

// @ts-expect-error event-deck is out of 1v1 product scope and is not a FabZone
export const eventDeckZone: FabZone = "event-deck";

export const legalPlayOriginEffect: FabEffect = {
  type: "play-card",
  source: { selector: "self" },
  fromZones: ["hand", "arsenal", "banished", "deck", "graveyard"],
};

/** Timing-only grants omit fromZones; they must not typecheck as origin permissions. */
export const timingOnlyAsInstantGrant: FabEffect = {
  type: "play-card",
  source: { selector: "self" },
  asType: "instant",
  duration: "this-turn",
};

export const unreachablePlayOriginEffect: FabEffect = {
  type: "play-card",
  source: { selector: "self" },
  // @ts-expect-error soul is a card zone, but cards cannot be declared for play from it
  fromZones: ["soul"],
};

export const unreachableStaticPlayOrigin: FabPlayModification = {
  role: "permission",
  // @ts-expect-error static play permissions use the same reachable origin contract
  fromZones: ["soul"],
};

export const authorableFrozen: FabAuthorableHasStatusCondition = {
  type: "has-status",
  status: "frozen",
};

export const authorableMarked: FabAuthorableHasStatusCondition = {
  type: "has-status",
  status: "marked",
};

export const derivedThisTurn: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error derived this-turn slug is not an authorable has-status
  status: "a-weapon-you-control-has-hit-this-turn",
};

export const derivedThisWay: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error derived this-way slug is not an authorable has-status
  status: "pitched-this-way-earth-card",
};

export const derivedOrMore: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error N-or-more derived slug is not an authorable has-status
  status: "3-or-more-hyper-drivers-under-this",
};

export const derivedParty: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error party marker is out of 1v1 scope and not authorable
  status: "bravo-in-your-party",
};

export const derivedEquipmentCompare: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error derived equipment-count comparison is not an authorable has-status
  status: "control-less-equipment-than-all-other-heroes",
};

export const namedNimblism = namedCard("Nimblism");

export const comparedAmount = compareAmount(3, { op: "gte", value: 2 });
export const drewThisTurn = performedThisTurn("draw", "controller");
export const cardsInGraveyard = zoneCount({
  zone: "graveyard",
  player: "controller",
  comparison: { op: "gte", value: 1 },
});
export const chosenCardMatches = bindingMatches("it", { typeBox: { types: ["Action"] } });

// @ts-expect-error type-box phrases cannot be used as card names
export const namedTypeBox = namedCard("Attack Action Card");

export const lookWithBinding = lookThen({
  target: {
    selector: "object",
    declared: "at-resolution",
    player: "opponent",
    zones: ["deck"],
    position: "top",
    count: 1,
  },
  outputBinding: "it",
  then: { type: "draw", count: 1, player: "controller" },
});

// @ts-expect-error lookThen requires outputBinding
export const lookWithoutBinding = lookThen({
  target: {
    selector: "object",
    declared: "at-resolution",
    player: "opponent",
    zones: ["deck"],
    position: "top",
    count: 1,
  },
  then: { type: "draw", count: 1, player: "controller" },
});

const authoringCardBase = {
  canonicalId: "authoring-compile-card",
  slug: "authoring-compile-card",
  types: ["Generic", "Action"] as const,
};

export const authoringFrozenCard = defineFleshAndBloodCard({
  ...authoringCardBase,
  abilities: [
    {
      id: "a1",
      kind: "resolution",
      text: "If this is frozen, draw a card.",
      condition: { type: "has-status", status: "frozen" },
      effect: { type: "draw", count: 1, player: "controller" },
    },
  ],
});

// @ts-expect-error derived this-turn slug is not authorable
export const authoringDerivedThisTurnCard = defineFleshAndBloodCard({
  ...authoringCardBase,
  abilities: [
    {
      id: "a1",
      kind: "resolution",
      text: "If a weapon you control has hit this turn, draw a card.",
      condition: { type: "has-status", status: "a-weapon-you-control-has-hit-this-turn" },
      effect: { type: "draw", count: 1, player: "controller" },
    },
  ],
});

export const removedDerivedHandComparison: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error unused derived comparison slug left the authorable union
  status: "they-have-more-cards-in-hand-than-you",
};

export const removedNOrMoreRoll: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error derived roll-result slug is not an authorable has-status
  status: "roll-result-4-5--or-6",
};

export const removedThisWayPitch: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error derived this-way pitch slug is not an authorable has-status
  status: "pitched-attack-card-to-play-this",
};

export const removedNOrMoreDamage: FabAuthorableHasStatusCondition = {
  type: "has-status",
  // @ts-expect-error derived N-or-more damage slug is not an authorable has-status
  status: "dealt-damage-gte-equipment-count",
};
