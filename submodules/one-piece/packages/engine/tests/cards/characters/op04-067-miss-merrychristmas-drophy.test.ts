import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04MissMerrychristmasDrophy067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-067 Miss.MerryChristmas(Drophy)", () => {
  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04MissMerrychristmasDrophy067] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op04MissMerrychristmasDrophy067);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the Life Trigger cost to play the physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MissMerrychristmasDrophy067], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const merryChristmasId = engine.findCardInZone(
      "north",
      "life",
      op04MissMerrychristmasDrophy067,
    );

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.some((card) => card?.instanceId === merryChristmasId),
    ).toBe(true);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(merryChristmasId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Life Trigger cost without paying or playing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MissMerrychristmasDrophy067], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const merryChristmasId = engine.findCardInZone(
      "north",
      "life",
      op04MissMerrychristmasDrophy067,
    );

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(1);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === merryChristmasId),
    ).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(merryChristmasId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Life Trigger itself and take the physical card into hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MissMerrychristmasDrophy067], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const merryChristmasId = engine.findCardInZone(
      "north",
      "life",
      op04MissMerrychristmasDrophy067,
    );

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "decline" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(1);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(merryChristmasId);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === merryChristmasId),
    ).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(merryChristmasId);
    expect(view.prompts).toHaveLength(0);
  });
});
