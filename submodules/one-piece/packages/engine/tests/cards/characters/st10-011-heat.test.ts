import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-011-heat", () => {
  test("DON return gains 2000 through opponent turn and expires at next own turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST10-003", character: ["ST10-011"], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("an opponent-turn DON return does not grant power", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-085"], activeDon: 5 },
      { character: ["ST10-011"], activeDon: 1 },
    );
    e.playCard("OP02-085", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.activeDon).toBe(0);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(4000);
  });

  test("opponent Magellan returns DON on our turn; another return cannot repeat the effect", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["ST10-011", { cardId: "ST02-013", playedOnTurn: 0 }],
        activeDon: 4,
        hand: ["OP02-090"],
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
    const observer = e.findCardInZone("south", "character", "ST10-011"),
      magellan = e.findCardInZone("north", "character", "OP02-085");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-013"), magellan, "south");
    expect(e.getView("south").players.south.activeDon).toBe(2);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === observer)?.power,
    ).toBe(6000);
    e.playCard("OP02-090", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === observer)?.power,
    ).toBe(6000);
    expect(
      e.getView("south").players.south.characters.some((c) => c?.instanceId === observer),
    ).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("does not react when only the opponent's DON returns on our turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST10-011"] },
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
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    expect(e.getView("south").players.north.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
