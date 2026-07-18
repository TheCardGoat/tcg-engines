import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09NicoOlvia106,
  op09NicoRobin062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-106 Nico Olvia", () => {
  test("On Play gives the Nico Robin Leader +3000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09NicoRobin062,
      hand: [op09NicoOlvia106],
      activeDon: op09NicoOlvia106.cost,
    });
    const leaderId = engine.leader("south");

    engine.playCard(op09NicoOlvia106, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(8000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test("Life Trigger draws three, then trashes two chosen cards for Nico Robin", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op09NicoRobin062,
        life: [op09NicoOlvia106],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Olvia's discard choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    const selectedIds = trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds }, "north");

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(selectedIds),
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
