import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb01BlastBreathJollyRogerFoil016 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST04-016 Blast Breath reprint", () => {
  test("Counter returns one DON!! before granting +4000 to the defending Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [prb01BlastBreathJollyRogerFoil016], activeDon: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", prb01BlastBreathJollyRogerFoil016);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.activeDon + view.players.north.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
