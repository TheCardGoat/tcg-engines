import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op09GumGumCuatroJetCrossShockBazooka039,
  op09Lim022,
  op09Yasopp013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-039 Gum-Gum Cuatro Jet Cross Shock Bazooka", () => {
  test("Counter checks the ODYSSEY Leader and two rested Characters before granting turn-long power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Yasopp013, playedOnTurn: 0 }] },
      {
        leaderCardId: op09Lim022,
        hand: [op09GumGumCuatroJetCrossShockBazooka039],
        character: [
          { card: eb01Doma005, rested: true },
          { card: op05Pell014, rested: true },
        ],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op09Yasopp013);
    const eventId = engine.findCardInZone("north", "hand", op09GumGumCuatroJetCrossShockBazooka039);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.leader.power).toBe(7000);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s only a rested Character at the cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op05Pell014, rested: true },
        ],
      },
      { life: [op09GumGumCuatroJetCrossShockBazooka039] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05Pell014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
