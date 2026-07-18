import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op02Squard009,
  op02YouMayBeAFoolButIStillLoveYou023,
  op03PortgasDAce001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-023 You May Be a Fool...but I Still Love You", () => {
  test("at exactly 3 Life, prevents Squard's own effect from adding Life to hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03PortgasDAce001,
      hand: [op02YouMayBeAFoolButIStillLoveYou023, op02Squard009],
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 4,
    });

    engine.playCard(op02YouMayBeAFoolButIStillLoveYou023);
    engine.playCard(op02Squard009);

    const view = engine.getView("south");
    expect(view.players.south.life).toHaveLength(3);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("above 3 Life, leaves the restriction inactive and Squard adds the top Life card to hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03PortgasDAce001,
      hand: [op02YouMayBeAFoolButIStillLoveYou023, op02Squard009],
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Sanji014],
      activeDon: 4,
    });
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.playCard(op02YouMayBeAFoolButIStillLoveYou023);
    engine.playCard(op02Squard009);

    const view = engine.getView("south");
    expect(view.players.south.life).toHaveLength(3);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([topLifeId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the Life Trigger's own-Leader choice and expires the power at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op02YouMayBeAFoolButIStillLoveYou023],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const leaderId = engine.leader("north");
    const powerBefore = engine.getView("north").players.north.leader.power;
    if (powerBefore === null) {
      throw new Error("Expected the Leader to expose its current power.");
    }

    engine.declareAttack(attackerId, leaderId, "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose their Leader.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "north");
    expect(engine.getView("north").players.north.leader.power).toBe(powerBefore + 1000);

    engine.endTurn("south");
    expect(engine.getView("north").players.north.leader.power).toBe(powerBefore);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
