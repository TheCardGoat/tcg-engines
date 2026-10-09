import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("parsed Brannew searches exact Navy, including compound types", () => {
  const card = getCard("OP03-089");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create({
      hand: [card],
      deck: ["OP03-079", "OP03-051", "OP11-011", "EB01-005"],
      activeDon: 2,
    });
    const navy = engine.findCardInZone("south", "deck", "OP03-079");
    const former = engine.findCardInZone("south", "deck", "OP03-051");
    const neo = engine.findCardInZone("south", "deck", "OP11-011");
    engine.playCard(card);
    const step = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected search candidates.");
    expect(
      step.candidates.filter((candidate) => candidate.legal).map((candidate) => candidate.ref.id),
    ).toEqual([navy]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [navy] }, "south");
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([navy]);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([former, neo]),
    );
  } finally {
    card.effects = original;
  }
});

test("parsed Chopper plays Animal and excludes Animal Kingdom Pirates", () => {
  const card = getCard("OP04-010");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create({
      hand: [card, "OP04-004", "OP04-049"],
      activeDon: 3,
    });
    const animal = engine.findCardInZone("south", "hand", "OP04-004");
    const animalKingdom = engine.findCardInZone("south", "hand", "OP04-049");
    engine.playCard(card);
    const step = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Character play candidates.");
    expect(
      step.candidates.filter((candidate) => candidate.legal).map((candidate) => candidate.ref.id),
    ).toEqual([animal]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [animal] }, "south");
    expect(
      engine.getView("south").players.south.characters.some((c) => c?.instanceId === animal),
    ).toBe(true);
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([
      animalKingdom,
    ]);
  } finally {
    card.effects = original;
  }
});
