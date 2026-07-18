import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02EmporioIvankov049,
  op05BartholomewKuma011,
  op05BeloBetty002,
  op05NicoRobin010,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-011 Bartholomew Kuma", () => {
  test("has the two separate official types", () => {
    expect(op05BartholomewKuma011.traits).toEqual([
      "The Seven Warlords of the Sea",
      "Revolutionary Army",
    ]);
  });

  test("K.O.s only an opposing Character at the 2000-power boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05BartholomewKuma011], activeDon: op05BartholomewKuma011.cost },
      { character: [op05NicoRobin010, eb01Doma005] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op05NicoRobin010);
    const ineligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05BartholomewKuma011, "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Kuma's K.O. target.");
    expect(selection).toMatchObject({ min: 0, max: 1 });
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("may decline the up-to-one On Play K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05BartholomewKuma011], activeDon: op05BartholomewKuma011.cost },
      { character: [op05NicoRobin010] },
    );
    const targetId = engine.findCardInZone("north", "character", op05NicoRobin010);

    engine.playCard(op05BartholomewKuma011, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(targetId);
    expect(
      engine.getView("south").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(targetId);
  });

  test("a multicolored Leader plays the physical Life Trigger card before its On Play K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op05NicoRobin010, rested: true },
        ],
      },
      { leaderCardId: op05BeloBetty002, life: [op05BartholomewKuma011] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05NicoRobin010);
    const triggerId = engine.findCardInZone("north", "life", op05BartholomewKuma011);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("a monocolored Leader cannot play the card through its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op02EmporioIvankov049,
        life: [op05BartholomewKuma011, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op05BartholomewKuma011);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
