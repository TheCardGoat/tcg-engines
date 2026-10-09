import { describe, expect, test } from "vite-plus/test";
import { eb02GumGumGiantPistol021, op02IceAge117 } from "@tcg/op-cards";
import { op15MonkeyDLuffy119 } from "../../../../../cards/src/cards/characters/op15-119-monkey-d-luffy.ts";
import { op15Yama073 } from "../../../../../cards/src/cards/characters/op15-073-yama.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-119 Monkey.D.Luffy", () => {
  test("gains Rush with 6 or more DON!! on the field", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15MonkeyDLuffy119], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op15MonkeyDLuffy119);
    const luffyId = engine.findCardInZone("south", "character", op15MonkeyDLuffy119);

    // Rush lets the just-played Luffy attack immediately.
    engine.declareAttack(luffyId, engine.leader("north"), "south");
  });

  test("gains 1000 power per revealed Life cost when the opponent activates an Event", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15MonkeyDLuffy119],
        life: [op02IceAge117, op02IceAge117],
        activeDon: 2,
      },
      { hand: [eb02GumGumGiantPistol021], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.playCard(eb02GumGumGiantPistol021, "north");
    engine.resolveDecision("effectRevealFromLifeSelection", { optionId: "1" }, "south");

    // 7000 base + 1000 per the revealed Life card's cost of 1.
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(8000);
  });

  test("gains 1000 power per revealed Life cost when the opponent declares a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15MonkeyDLuffy119],
        life: [op02IceAge117, op02IceAge117],
        activeDon: 6,
      },
      { character: [op15Yama073], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op15MonkeyDLuffy119);
    const yamaId = engine.findCardInZone("north", "character", op15Yama073);

    engine.attachDon(luffyId, 4, "south");
    engine.declareAttack(luffyId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    engine.resolveDecision("battleBlocker", { selectedIds: [yamaId] }, "north");
    engine.resolveDecision("effectRevealFromLifeSelection", { optionId: "1" }, "south");

    // 7000 base + 4000 from DON!! + 1000 per the revealed Life card's cost.
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(12000);
  });
  test("does not gain Blocker from mentioning the opponent's Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15MonkeyDLuffy119, op15Yama073] },
      { activeDon: 2 },
    );
    engine.endTurn("south");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blocker choice");
    expect(blocker.candidates.map((c) => c.ref.id)).toEqual([
      "skip",
      engine.findCardInZone("south", "character", op15Yama073),
    ]);
  });
  test("FAQ: an already face-up Life card can be revealed again for its cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15MonkeyDLuffy119],
        life: [{ card: op02IceAge117, faceUp: true, publicKnowledge: true }, op02IceAge117],
      },
      { hand: [eb02GumGumGiantPistol021], activeDon: 5 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    engine.playCard(eb02GumGumGiantPistol021, "north");
    engine.resolveDecision("effectRevealFromLifeSelection", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
  });
  test("FAQ: opponent Event Life Trigger does not count as activating an Event", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15MonkeyDLuffy119], life: [op02IceAge117], activeDon: 6 },
      { life: [op02IceAge117, "OP12-013"] },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", op15MonkeyDLuffy119),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const view = engine.getView("south");
    expect(view.players.south.characters[0]?.power).toBe(7000);
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.trash.map((c) => c.cardId)).toContain("OP02-117");
  });
});
