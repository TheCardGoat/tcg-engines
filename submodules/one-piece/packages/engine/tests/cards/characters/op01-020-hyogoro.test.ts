import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Hyogoro020 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-020 Hyogoro", () => {
  test("rests itself to give a Leader or Character +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op01Hyogoro020, eb01Doma005],
    });
    const hyogoroId = engine.findCardInZone("south", "character", op01Hyogoro020);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(hyogoroId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === hyogoroId)?.rested,
    ).toBe(true);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(5000);

    engine.endTurn("south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [op01Hyogoro020, eb01Doma005],
    });
    const hyogoroId = engine.findCardInZone("south", "character", op01Hyogoro020);
    engine.activateEffect(hyogoroId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
