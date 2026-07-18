import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Usopp024,
  op12TwoSwordStyleRashomon038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-038 Two-Sword Style Rashomon", () => {
  test("Main pays the optional 2-DON!! cost before K.O.ing two rested base-cost-4 Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op12TwoSwordStyleRashomon038], activeDon: 3 },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: op09Usopp024, rested: true },
          eb01MountainGod018,
        ],
      },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", op09Usopp024);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12TwoSwordStyleRashomon038);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected two rested Character targets.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op12TwoSwordStyleRashomon038], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op12TwoSwordStyleRashomon038);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
