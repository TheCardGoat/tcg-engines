import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB02-035", () => {
  test("[On Play] with equal DON!! counts draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB02-035"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("EB02-035");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Your Turn] returning 2 DON!! lets it add an active DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB02-035", attachedDon: 0 }], hand: ["OP09-077"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP09-077");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // Gum-Gum Lightning's DON!! -2 cost returns 2 of our DON!! cards.
    const pay = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (pay?.kind !== "payCost") throw new Error("Expected the DON!! payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: pay.candidates.slice(0, 2).map((c) => c.ref.id) },
      "south",
    );
    // Gum-Gum Lightning's own K.O. selection comes first: decline it.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! count choice.");
    const beforeAdd = engine.getView("south").players.south;
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.activeDon).toBe(beforeAdd.activeDon + 1);
    expect(engine.getView("south").players.south.donDeckCount).toBe(beforeAdd.donDeckCount - 1);
  });
  test("returning only one DON!! does not trigger the two-DON ability", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-058", character: ["EB02-035"], activeDon: 1 },
      {},
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(0);
    expect(south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("two separate DON minus one payments do not count as a simultaneous return", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB02-035"], hand: ["OP01-117", "OP01-117"], activeDon: 6 },
      { character: ["EB01-005"] },
    );
    const before = e.getView("south").players.south.donDeckCount;
    e.playCard("OP01-117");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    let p = e.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("DON cost");
    e.resolveDecision("effectCostReturnDon", { selectedIds: [p.candidates[0]!.ref.id] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    e.playCard("OP01-117");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    p = e.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("DON cost");
    e.resolveDecision("effectCostReturnDon", { selectedIds: [p.candidates[0]!.ref.id] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.donDeckCount).toBe(before + 2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Luffy-Tarou's returned DON makes the newly played Sanji and Pudding draw at equality", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST18-005", "EB02-035"], activeDon: 7, deck: ["ST02-002", "EB01-005"] },
      { activeDon: 6 },
    );
    e.playCard("ST18-005");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const card = e.findCardInZone("south", "hand", "EB02-035");
    e.resolveDecision("effectPlaySelection", { selectedIds: [card] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(card);
  });
});
