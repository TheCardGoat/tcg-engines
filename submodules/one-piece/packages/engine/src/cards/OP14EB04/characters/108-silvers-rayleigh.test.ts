import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile067,
  op01Kaido094,
  op01RoronoaZoro001,
  op04Rebecca039,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04SilversRayleigh108 } from "../../../../../cards/src/cards/OP14EB04/characters/108-silvers-rayleigh.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-108 Silvers Rayleigh", () => {
  test("on play with a multicolored Leader and opponent at three Life K.O.s by printed base power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        character: [{ card: op01Crocodile067, attachedDon: 2 }, op01Kaido094],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", op01Crocodile067);
    const highBasePowerId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.playCard(op14eb04SilversRayleigh108, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Rayleigh's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highBasePowerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(
      highBasePowerId,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("requires both a multicolored Leader and opponent at three or less Life", () => {
    const lifeTooHigh = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op01Crocodile067],
      },
    );
    const highLifeTargetId = lifeTooHigh.findCardInZone("north", "character", op01Crocodile067);
    lifeTooHigh.playCard(op14eb04SilversRayleigh108, "south");
    expect(
      lifeTooHigh.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(highLifeTargetId);
    expect(lifeTooHigh.getView("south").prompts).toHaveLength(0);

    const monoLeader = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        character: [op01Crocodile067],
      },
    );
    const monoTargetId = monoLeader.findCardInZone("north", "character", op01Crocodile067);
    monoLeader.playCard(op14eb04SilversRayleigh108, "south");
    expect(
      monoLeader.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(monoTargetId);
    expect(monoLeader.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger activates On Play without playing Rayleigh and disposes the physical Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op04Rebecca039,
        life: [op14eb04SilversRayleigh108, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04SilversRayleigh108);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Rayleigh's Trigger K.O.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(triggerId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
