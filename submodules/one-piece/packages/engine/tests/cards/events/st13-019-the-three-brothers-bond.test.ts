import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02PortgasDAce028,
  eb02Sabo002,
  op01MonkeyDLuffy024,
  prb02TheThreeBrothersBondPirateFoil019,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST13-019 The Three Brothers' Bond reprint", () => {
  test("Life Trigger activates Main and accepts cost-5-or-less Sabo, Ace, or Luffy", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [prb02TheThreeBrothersBondPirateFoil019],
        deck: [
          eb02Sabo002,
          eb02PortgasDAce028,
          op01MonkeyDLuffy024,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const saboId = engine.findCardInZone("north", "deck", eb02Sabo002);
    const aceId = engine.findCardInZone("north", "deck", eb02PortgasDAce028);
    const luffyId = engine.findCardInZone("north", "deck", op01MonkeyDLuffy024);
    const initialDeck = [...engine.getState().players.north.deck].slice(0, 5);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const decision = engine.pendingDecision("effectSearchSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a three-name search choice.");
    for (const id of [saboId, aceId, luffyId]) {
      expect(step.candidates.find((candidate) => candidate.ref.id === id)?.legal).toBe(true);
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [aceId] }, "north");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: initialDeck.filter((id) => id !== aceId) },
      "north",
    );
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      aceId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
