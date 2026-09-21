import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04CaponeGangBege100 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe('OP04-100 Capone"Gang"Bege', () => {
  test("Trigger prevents the chosen opposing Leader from attacking only this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op04CaponeGangBege100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const otherCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const southLeaderId = engine.leader("south");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectTargetSelection", "north");
    expect(decision.actorId).toBe("north");
    const target = decision.steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Bege's attack restriction.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([southLeaderId, otherCharacterId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.leader("north"),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [southLeaderId] }, "north");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: southLeaderId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(southLeaderId, engine.leader("north"), "south");
  });

  test("Trigger can prevent the chosen opposing Character from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op04CaponeGangBege100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restrictedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "north");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: restrictedId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Trigger resolves without a target when the selection is declined", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op04CaponeGangBege100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const southLeaderId = engine.leader("south");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const spectatorLogs = engine.getView("spectator").logs.map((entry) => entry.message);
    expect(spectatorLogs.find((message) => /prevents\s+from/.test(message))).toBeUndefined();
    expect(
      spectatorLogs.find((message) => /resolves without a target\./.test(message)),
    ).toBeTruthy();

    // No cannotAttack modifier was applied: the Leader is free to attack.
    engine.declareAttack(southLeaderId, engine.leader("north"), "south");
  });
});
