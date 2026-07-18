import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08CharlotteOven061 } from "@tcg/op-cards";
import { op11CharlotteKatakuri067 } from "../../../../../cards/src/cards/OP11/characters/067-charlotte-katakuri.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-067 Charlotte Katakuri", () => {
  test("at end of turn sets two eligible Big Mom Pirates Characters active and adds rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        { card: op11CharlotteKatakuri067, rested: true },
        { card: op08CharlotteOven061, rested: true },
        { card: eb01Doma005, rested: true },
      ],
      donDeckCount: 1,
    });
    const katakuriId = engine.findCardInZone("south", "character", op11CharlotteKatakuri067);
    const ovenId = engine.findCardInZone("south", "character", op08CharlotteOven061);
    const ineligibleId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.endTurn("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Katakuri's active targets.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([katakuriId, ovenId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [katakuriId, ovenId] }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === katakuriId)?.rested,
    ).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === ovenId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker to redirect an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlotteKatakuri067] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const katakuriId = engine.findCardInZone("south", "character", op11CharlotteKatakuri067);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Katakuri's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(katakuriId);
  });
});
