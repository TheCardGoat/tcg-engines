import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12RoronoaZoro020,
  op12SlamGibson117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-117 Slam Gibson", () => {
  test("Main pays five DON!! then moves either field's Character to owner Life face-down", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        hand: [op12SlamGibson117],
        character: [eb01Doma005],
        activeDon: 6,
      },
      { character: [eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12SlamGibson117);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected an owner-neutral Life choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(opposingId);
    expect(engine.getState().cards[opposingId]?.faceUp).toBe(false);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives only the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op12SlamGibson117], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op12SlamGibson117);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
