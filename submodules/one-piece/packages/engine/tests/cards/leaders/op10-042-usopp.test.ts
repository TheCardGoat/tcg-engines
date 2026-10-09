import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04Bartolomeo089,
  op10Bartolomeo052,
  op10Kyros046,
  op10Leo057,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-042 Usopp", () => {
  test("adds cost continuously and draws when an opponent effect removes a Dressrosa Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [op04Bartolomeo089, op10Leo057],
        deck: [eb01Doma005, eb01Doma005],
      },
      { hand: [op10Kyros046], activeDon: 7 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op04Bartolomeo089);
    const leoId = engine.findCardInZone("south", "character", op10Leo057);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === bartolomeoId)?.cost,
    ).toBe(4);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === leoId)
        ?.cost,
    ).toBe(1);

    engine.playCard(op10Kyros046, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bartolomeoId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bartolomeoId);
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws when an opposing attack K.O.'s a Dressrosa Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [{ card: op10Bartolomeo052, rested: true }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", op10Bartolomeo052);

    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), targetId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [{ card: op10Bartolomeo052, rested: true }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", op10Bartolomeo052);
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), targetId, "north");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: Tsuru's minus-two cost leaves Bartolomeo at two", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP10-042", character: ["OP04-089"] },
      { leaderCardId: "ST01-001", hand: ["OP02-106"], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const b = e.findCardInZone("south", "character", "OP04-089");
    e.asNorth().play("OP02-106");
    e.asNorth().chooseTargets(b);
    expect(e.getView("south").players.south.characters.find((c) => c?.instanceId === b)?.cost).toBe(
      2,
    );
  });
  test("FAQ: Kaku's minus-three cost disables Usopp's threshold boost", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP10-042", character: ["OP04-089"] },
      {
        leaderCardId: "ST01-001",
        hand: ["OP07-080"],
        trash: ["OP07-080", "OP07-080"],
        activeDon: 4,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const b = e.findCardInZone("south", "character", "OP04-089");
    e.asNorth().play("OP07-080");
    e.asNorth().acceptOptional();
    const p = e.pendingDecision("effectCostReturnTrashToDeck", "north").steps[0];
    if (p?.kind !== "payCost") throw new Error("Expected trash order");
    e.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: p.candidates.map((c) => c.ref.id) },
      "north",
    );
    e.asNorth().chooseTargets(b);
    expect(e.getView("south").players.south.characters.find((c) => c?.instanceId === b)?.cost).toBe(
      0,
    );
  });
  test("FAQ: active-player Issho applies before non-turn Usopp's cost threshold", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP10-042", character: ["OP04-089"] },
      { leaderCardId: "ST01-001", character: ["OP03-078"], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const b = e.findCardInZone("south", "character", "OP04-089");
    e.asNorth().attachDon(e.findCardInZone("north", "character", "OP03-078"), 1);
    expect(e.getView("south").players.south.characters.find((c) => c?.instanceId === b)?.cost).toBe(
      0,
    );
  });
  test("may activate without drawing when the removed Character makes its hand exceed five", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        hand: Array.from({ length: 5 }, () => eb01Doma005),
        character: [op04Bartolomeo089],
        deck: [eb01Doma005, eb01Doma005],
      },
      { hand: [op10Kyros046], activeDon: 7 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const returned = engine.findCardInZone("south", "character", op04Bartolomeo089);
    engine.asNorth().play(op10Kyros046);
    engine.asNorth().chooseTargets(returned);
    engine.asSouth().acceptOptional();
    expect(engine.getView("south").players.south.hand).toHaveLength(6);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      returned,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
