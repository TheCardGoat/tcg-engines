import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04CorridaColiseum096, op10Nami088, op10Usopp042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-088 Nami", () => {
  test("cannot activate without resting a Dressrosa Leader or Stage alongside itself", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Nami088],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const namiId = engine.findCardInZone("south", "character", op10Nami088);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: namiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("pays both rest costs, draws 1, then trashes the next 2 deck cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Usopp042,
      character: [op10Nami088],
      stage: op04CorridaColiseum096,
      deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const namiId = engine.findCardInZone("south", "character", op10Nami088);
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);

    engine.activateEffect(namiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === namiId)?.rested).toBe(
      true,
    );
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 1 });
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Usopp042,
      character: [op10Nami088],
      stage: op04CorridaColiseum096,
      deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const namiId = engine.findCardInZone("south", "character", op10Nami088);
    engine.activateEffect(namiId, "activateMain", "south");
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
