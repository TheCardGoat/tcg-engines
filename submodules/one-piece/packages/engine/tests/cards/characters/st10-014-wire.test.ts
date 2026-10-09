import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-014-wire", () => {
  test("DON return must draw then discard once per turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST10-003",
        character: ["ST10-014"],
        activeDon: 1,
        hand: ["ST02-002"],
        deck: ["ST02-012", "ST02-006"],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const old = e.findCardInZone("south", "hand", "ST02-002");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.handCount).toBe(2);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [old] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-012"]);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(old);
  });
  test("Blocker redirects an attack", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST10-014"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const wire = e.findCardInZone("north", "character", "ST10-014");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [wire] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(wire);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
  });
  test("declines Blocker and takes Leader damage", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST10-014"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    expect(e.getView("south").players.north.lifeCount).toBe(3);
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(false);
  });

  test("opponent Magellan returns DON on our turn; another return cannot repeat the effect", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["ST10-014", { cardId: "ST02-013", playedOnTurn: 0 }],
        activeDon: 4,
        hand: ["OP02-090", "ST02-002"],
        deck: ["ST02-012", "ST02-006", "ST02-002"],
      },
      {
        character: [
          { cardId: "OP02-085", rested: true },
          { cardId: "ST02-012", rested: true },
          { cardId: "ST02-012", rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const observer = e.findCardInZone("south", "character", "ST10-014"),
      magellan = e.findCardInZone("north", "character", "OP02-085");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-013"), magellan, "south");
    expect(e.getView("south").players.south.activeDon).toBe(2);
    expect(e.getView("south").players.south.handCount).toBe(3);
    e.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [e.findCardInZone("south", "hand", "ST02-002")] },
      "south",
    );
    e.playCard("OP02-090", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-012"]);
    expect(
      e.getView("south").players.south.characters.some((c) => c?.instanceId === observer),
    ).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("opponent-turn DON return also forces draw and discard", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-085"], activeDon: 5 },
      { character: ["ST10-014"], activeDon: 1, hand: ["ST02-002"], deck: ["ST02-012", "ST02-006"] },
    );
    const old = e.findCardInZone("north", "hand", "ST02-002");
    e.playCard("OP02-085", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("north").players.north.handCount).toBe(2);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [old] }, "north");
    expect(e.getView("north").players.north.activeDon).toBe(0);
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-012"]);
    expect(e.getView("north").prompts).toHaveLength(0);
  });

  test("does not react when only the opponent's DON returns on our turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST10-014"] },
      { character: [{ cardId: "ST02-012", rested: true }], hand: ["OP02-089"], activeDon: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "OP02-089")] },
      "north",
    );
    e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.north.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
