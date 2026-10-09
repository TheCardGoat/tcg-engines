import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-076 The Three Admirals", () => {
  test("Counter does not grant power without its printed eligibility", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP16-076"], character: ["EB01-005"], activeDon: 3 },
      {},
      { activeSeat: "north" },
    );
    const before = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP16-076")] },
      "south",
    );
    expect(e.getView("south").players.south.lifeCount).toBe(before - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter executes the printed power bonus through battle", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP16-076"], character: ["OP16-063"], activeDon: 3 },
      {},
      { activeSeat: "north" },
    );
    const lifeBefore = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP16-076")] },
      "south",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-076");
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] resting 3 DON!! boosts an Admiral Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-076"], activeDon: 6, character: ["OP16-063"] },
      {},
    );

    engine.playCard("OP16-076");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.findCardInZone("south", "character", "OP16-063")] },
      "south",
    );
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(10000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the rest keeps the DON!! active", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-076"], activeDon: 6 }, {});

    engine.playCard("OP16-076");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
