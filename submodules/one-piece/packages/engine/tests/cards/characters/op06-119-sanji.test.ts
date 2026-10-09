import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06RoronoaZoro118, op06Sanji119 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-119 Sanji", () => {
  test("reveals and plays a non-Sanji Character costing 9 or less from the deck top", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Sanji119],
      deck: [op06RoronoaZoro118, eb01Doma005],
      activeDon: op06Sanji119.cost,
    });
    const zoroId = engine.findCardInZone("south", "deck", op06RoronoaZoro118);

    engine.playCard(op06Sanji119, "south");
    expect(engine.getView("north").logs.some((entry) => entry.message.includes("reveals "))).toBe(
      true,
    );
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Sanji's top-deck play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([zoroId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [zoroId] }, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === zoroId),
    ).toBe(true);
  });

  test("cannot play another Sanji and places it at the deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Sanji119],
      deck: [op06Sanji119, eb01Doma005],
      activeDon: op06Sanji119.cost,
    });
    const topSanjiId = engine.findCardInZone("south", "deck", op06Sanji119);

    engine.playCard(op06Sanji119, "south");
    expect(engine.getView("north").logs.some((entry) => entry.message.includes("reveals "))).toBe(
      true,
    );

    expect(engine.getState().players.south.deck.at(-1)).toBe(topSanjiId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("reveals an eligible top card to both players even when declining its play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Sanji119],
      deck: [op06RoronoaZoro118, eb01Doma005],
      activeDon: 9,
    });
    const topId = engine.findCardInZone("south", "deck", op06RoronoaZoro118);
    engine.asSouth().play(op06Sanji119);
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes("reveals Roronoa Zoro")),
    ).toBe(true);
    engine.asSouth().chooseNoPlay();
    // Hidden-zone identity is needed to prove the printed bottom-deck instruction.
    expect(engine.getState().players.south.deck.at(-1)).toBe(topId);
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
