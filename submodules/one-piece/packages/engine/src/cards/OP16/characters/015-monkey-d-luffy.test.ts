import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op16MonkeyDLuffy015, op16PortgasDAce001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP16-015 Monkey.D.Luffy", () => {
  test("under an Ace Leader with 6+ DON!! the hand copy costs 2 less", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op16PortgasDAce001,
        hand: [op16MonkeyDLuffy015],
        activeDon: 6,
      },
      {},
    );
    const handCost = () => engine.getView("south").players.south.hand[0]?.cost;

    expect(handCost()).toBe(2);
  });

  test("the hand discount needs both the Ace name and 6 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op16PortgasDAce001,
        hand: [op16MonkeyDLuffy015],
        activeDon: 5,
      },
      {},
    );
    expect(engine.getView("south").players.south.hand[0]?.cost).toBe(4);

    const other = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        hand: [op16MonkeyDLuffy015],
        activeDon: 6,
      },
      {},
    );
    expect(other.getView("south").players.south.hand[0]?.cost).toBe(4);
  });

  test("trashing an exactly-8000 Character sets Leader and itself to 7000 base for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op16PortgasDAce001,
        character: [{ card: op16MonkeyDLuffy015, rested: true }],
        hand: ["OP16-096", eb01Doma005],
        activeDon: 6,
      },
      { character: [{ cardId: "OP16-109", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const luffyId = engine.findCardInZone("south", "character", op16MonkeyDLuffy015);
    const attackerId = engine.findCardInZone("north", "character", "OP16-109");

    engine.declareAttack(attackerId, luffyId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // Yamato (8000) is the only eligible Character, so the trash auto-pays.
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.cardId)).toContain("OP16-096");
    expect(view.players.south.leader?.power).toBe(7000);
    expect(view.players.south.characters.find((c) => c?.instanceId === luffyId)?.power).toBe(7000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    // The turn-scoped base power expires when north's turn ends.
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
  });
  test("declining the onOpponentAttack window leaves everything untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op16PortgasDAce001,
        character: [{ card: op16MonkeyDLuffy015, rested: true }],
        hand: ["OP16-096"],
        activeDon: 6,
      },
      { character: [{ cardId: "OP16-109", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const luffyId = engine.findCardInZone("south", "character", op16MonkeyDLuffy015);
    const attackerId = engine.findCardInZone("north", "character", "OP16-109");

    engine.declareAttack(attackerId, luffyId, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.leader?.power).toBe(5000);
    expect(south.characters.find((c) => c?.instanceId === luffyId)?.power).toBe(6000);
    expect(south.trash).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
