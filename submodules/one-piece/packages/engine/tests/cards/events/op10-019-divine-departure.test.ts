import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op10DivineDeparture019,
  op10Franky014,
  op14eb04Kaido030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-019 Divine Departure", () => {
  test("Main rests five DON!! as the optional activation cost before the power-8000 K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10DivineDeparture019], activeDon: 6 },
      { character: [op10Franky014, op14eb04Kaido030] },
    );
    const boundaryId = engine.findCardInZone("north", "character", op10Franky014);
    const excludedId = engine.findCardInZone("north", "character", op14eb04Kaido030);

    engine.playCard(op10DivineDeparture019);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the paid power-8000 K.O. choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(boundaryId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives only the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op10DivineDeparture019], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op10DivineDeparture019);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes("+3000 power")),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
