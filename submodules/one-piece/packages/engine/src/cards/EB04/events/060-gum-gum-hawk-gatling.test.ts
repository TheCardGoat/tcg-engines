import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-060 Gum-Gum Hawk Gatling", () => {
  test("Main adds the chosen Egghead Character to top Life face-up, then reduces power for this turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB04-060", "EB04-002", "EB01-005"], activeDon: 2, life: ["ST01-002", "ST01-003"] },
      { character: ["EB01-005"] },
    );
    const chosen = e.findCardInZone("south", "hand", "EB04-002");
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.playCard("EB04-060");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Egghead Life selection.");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([chosen]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [chosen] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("north").players.south.life[0]).toMatchObject({
      instanceId: chosen,
      cardId: "EB04-002",
      hidden: false,
    });
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
      "EB01-005",
      "ST01-002",
    ]);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(2000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.north.characters[0]?.power).toBe(3000);
  });

  test("Life Trigger draws two and trashes the selected drawn card without paying the Main Life cost", () => {
    const e = OnePieceTestEngine.create(
      {},
      { life: ["EB04-060", "ST01-002"], deck: ["EB01-005", "EB01-025", "ST01-003"] },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const discarded = e.findCardInZone("north", "hand", "EB01-005");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discarded] }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["EB01-025"]);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toEqual(
      expect.arrayContaining(["EB04-060", "EB01-005"]),
    );
    expect(e.getView("north").players.north).toMatchObject({ lifeCount: 1, deckCount: 1 });
    expect(e.getView("north").prompts).toHaveLength(0);
  });

  test("may pay with the bottom Life card and continue after adding no Character to Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-060"], activeDon: 2, life: ["ST01-002", "ST01-003"] },
      { character: ["EB01-005"] },
    );
    const target = engine.findCardInZone("north", "character", "EB01-005");
    engine.playCard("EB04-060");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST01-003",
    ]);
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] the add-Life-to-hand cost moves the top Life card to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-060", "EB01-005"],
        life: ["ST01-002", "ST01-003"],
        activeDon: 6,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard("EB04-060");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.hand.map((card) => card.cardId)).toContain("ST01-002");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-060", "EB04-002"], activeDon: 2, life: ["ST01-002", "ST01-003"] },
      { character: ["EB01-005"] },
    );
    const lifeBefore = engine.getView("north").players.south.life;

    engine.playCard("EB04-060");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB04-060");
    expect(engine.getView("north").players.south.life).toEqual(lifeBefore);
    expect(engine.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["EB04-002"]);
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
