import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-076 Wo Ro Ro Ro Ro! I Think I've Sobered Up", () => {
  test("[Counter] optional hand trash saves the Leader with +3000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-076", "EB01-005"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-076");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card auto-pays the trash cost.
    engine.asSouth().chooseTargets(engine.leader("south"));
    expect(engine.getView("south").prompts).toHaveLength(0);

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("[Counter] may be declined with a payable hand cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-076", "ST02-002"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP17-076");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger returns one DON and draws two cards", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-076", "ST02-002"], activeDon: 1, deck: ["ST02-002", "ST02-003", "ST02-002"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const donDeck = e.getView("south").players.south.donDeckCount;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.donDeckCount).toBe(donDeck + 1);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
      "ST02-002",
      "ST02-003",
    ]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-076");
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test.each([0, 1])(
    "Life Trigger draws nothing when DON payment is unavailable or declined (%i DON)",
    (don) => {
      const e = OnePieceTestEngine.create(
        {
          life: ["OP17-076", "ST02-002"],
          activeDon: don,
          deck: ["ST02-002", "ST02-003", "ST02-002"],
        },
        {},
        { activeSeat: "north", firstPlayer: "south" },
      );
      const before = e.getView("south").players.south;
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      if (don) e.asSouth().declineOptional();
      const after = e.getView("south").players.south;
      expect(after.handCount).toBe(0);
      expect(after.deckCount).toBe(before.deckCount);
      expect(after.donDeckCount).toBe(before.donDeckCount);
      expect(after.trash.map((c) => c.cardId)).toContain("OP17-076");
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
