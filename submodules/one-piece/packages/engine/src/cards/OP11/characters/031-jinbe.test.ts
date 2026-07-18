import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03Arlong022,
  op11Hatchan034,
  op11Jinbe031,
  op11Vito042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-031 Jinbe", () => {
  test("with an included Fish-Man Leader, rests only an opposing cost-5-or-less Character on play", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        hand: [op11Jinbe031],
        activeDon: op11Jinbe031.cost,
      },
      { character: [eb01MountainGod018, op11Jinbe031] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op11Jinbe031);

    engine.playCard(op11Jinbe031, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Jinbe's On Play rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
  });

  test("grants one included Fish-Man Character Rush: Character once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Hatchan034],
        character: [op11Jinbe031, op11Vito042],
        activeDon: op11Hatchan034.cost,
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op11Jinbe031);
    const wrongTraitId = engine.findCardInZone("south", "character", op11Vito042);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11Hatchan034, "south");
    const hatchanId = engine.findCardInZone("south", "character", op11Hatchan034);
    engine.activateEffect(jinbeId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Jinbe's Rush target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(hatchanId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hatchanId] }, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: hatchanId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
    engine.declareAttack(hatchanId, opposingId, "south");
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: jinbeId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
