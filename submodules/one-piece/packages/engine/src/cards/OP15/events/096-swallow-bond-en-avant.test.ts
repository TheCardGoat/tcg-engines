import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-096 Swallow Bond: En Avant", () => {
  test("[Main] resting a DON!! with a Straw Hat Leader trashes 5 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-022", hand: ["OP15-096"], deck: 8, trash: [], activeDon: 5 },
      {},
    );

    engine.playCard("OP15-096");
    engine.acceptLeadingOptional("south");

    const south = engine.getView("south").players.south;
    expect(south.deckCount).toBe(3);
    // Five deck cards plus the resolved event itself.
    expect(south.trash).toHaveLength(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Straw Hat Leader the Main effect is not offered", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-096"], deck: 8, trash: [], activeDon: 5 },
      {},
    );

    engine.playCard("OP15-096");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.deckCount).toBe(8);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each([true, false])("Counter's optional discard accepted=%s", (accept) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-096", "ST02-002", "ST02-003"], activeDon: 5 },
      { activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const payment = e.findCardInZone("south", "hand", "ST02-002");
    e.asNorth().attachDon(e.leader("north"), 2);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP15-096");
    e.resolveDecision("effectOptional", { optionId: accept ? "yes" : "no" }, "south");
    if (accept) {
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment] }, "south");
      e.asSouth().chooseTargets(e.leader("south"));
    }
    expect(e.getView("south").players.south.leader.power).toBe(accept ? 8000 : 5000);
    expect(e.getView("south").players.south.handCount).toBe(accept ? 1 : 2);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
