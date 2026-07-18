import { describe, expect, test } from "vite-plus/test";
import {
  op10CaesarClown002,
  op10Mocha015,
  op10Monet016,
  op10Smiley009,
  op10Vergo004,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-002 Caesar Clown", () => {
  test("maps the Punk Hazard return cost before choosing an opposing low-power K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10CaesarClown002,
        character: [op10Monet016, op10Mocha015, op10Vergo004],
        activeDon: 2,
      },
      { character: [op10Mocha015, op10Smiley009] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const monetId = engine.findCardInZone("south", "character", op10Monet016);
    const mochaId = engine.findCardInZone("south", "character", op10Mocha015);
    const vergoId = engine.findCardInZone("south", "character", op10Vergo004);
    const koId = engine.findCardInZone("north", "character", op10Mocha015);
    const excludedId = engine.findCardInZone("north", "character", op10Smiley009);

    engine.attachDon(engine.leader("south"), 2, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Caesar Clown's return cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([monetId, mochaId]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(vergoId);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [monetId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Caesar Clown's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([koId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(monetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
