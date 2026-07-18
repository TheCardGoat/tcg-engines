import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08Dalton008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-008 Dalton", () => {
  test("reduces an opponent, takes top Life with DON!! x1, then gains Rush once", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Dalton008],
        life: [eb01Doma005, eb01Doma005],
        activeDon: op08Dalton008.cost + 1,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeId = engine.getState().players.south.life[0]!;
    const basePower = eb01MountainGod018.power ?? 0;

    engine.playCard(op08Dalton008, "south");
    const daltonId = engine.findCardInZone("south", "character", op08Dalton008);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(basePower - 1000);

    engine.attachDon(daltonId, 1, "south");
    engine.activateEffect(daltonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    engine.declareAttack(daltonId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === daltonId)
        ?.rested,
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: daltonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("cannot activate its Rush effect without an attached DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08Dalton008],
      life: [eb01Doma005],
    });
    const daltonId = engine.findCardInZone("south", "character", op08Dalton008);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: daltonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
  });

  test("may decline without taking the top Life card", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08Dalton008],
      life: [eb01Doma005],
      activeDon: 1,
    });
    const daltonId = engine.findCardInZone("south", "character", op08Dalton008);
    const lifeBefore = [...engine.getState().players.south.life];
    engine.attachDon(daltonId, 1, "south");

    engine.activateEffect(daltonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
