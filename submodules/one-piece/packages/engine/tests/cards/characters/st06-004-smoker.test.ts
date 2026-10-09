import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-004 Smoker", () => {
  test("survives own and opponent effect KO while ordinary Characters are removed", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-061",
        hand: ["OP01-094"],
        character: ["ST06-004", "ST02-002"],
        activeDon: 10,
      },
      { character: ["ST06-004", "ST02-002"] },
    );
    e.playCard("OP01-094", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "ST06-004")).toBe(
      true,
    );
    expect(e.getView("south").players.north.characters.some((c) => c?.cardId === "ST06-004")).toBe(
      true,
    );
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("ST02-002");
  });
  test("one DON and an opposing zero-cost Character enable Double Attack", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST06-004", attachedDon: 1, playedOnTurn: 0 }],
        hand: ["ST06-008"],
        activeDon: 3,
      },
      { character: ["ST02-002"], life: ["ST02-002", "ST02-002", "ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST06-004");
    e.playCard("ST06-008", "south");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "ST02-002")] },
      "south",
    );
    e.declareAttack(id, e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(1);
  });
  test("without a zero-cost Character it deals only one damage", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST06-004", attachedDon: 1, playedOnTurn: 0 }] },
      { life: ["ST02-002", "ST02-002", "ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST06-004"), e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(2);
  });
  test("loses Double Attack if the only zero-cost Character leaves before damage", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST06-004", attachedDon: 1, playedOnTurn: 0 }],
        hand: ["ST06-008"],
        activeDon: 3,
      },
      {
        character: ["ST02-002"],
        hand: ["OP01-086"],
        activeDon: 2,
        life: ["ST02-002", "ST02-002", "ST02-002"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zero = e.findCardInZone("north", "character", "ST02-002");
    const counter = e.findCardInZone("north", "hand", "OP01-086");
    e.playCard("ST06-008", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [zero] }, "south");
    e.declareAttack(e.findCardInZone("south", "character", "ST06-004"), e.leader("north"), "south");
    e.resolveDecision("battleCounter", { selectedIds: [counter] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [zero] }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(zero);
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
  test("a zero-cost Character does not grant Double Attack without given DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST06-004", playedOnTurn: 0 }], hand: ["ST06-008"], activeDon: 3 },
      { character: ["ST02-002"], life: ["ST02-002", "ST02-002", "ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST06-008", "south");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "ST02-002")] },
      "south",
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST06-004"), e.leader("north"), "south");
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
  test("effect KO immunity does not prevent battle KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST06-004", rested: true }] },
      { character: [{ cardId: "OP01-120", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "ST06-004");
    e.declareAttack(e.findCardInZone("north", "character", "OP01-120"), id, "north");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
});
