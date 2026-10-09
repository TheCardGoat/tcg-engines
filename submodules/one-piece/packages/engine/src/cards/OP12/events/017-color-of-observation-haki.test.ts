import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-017 Color of Observation Haki", () => {
  test.each(["OP12-019", "OP12-009"])(
    "search accepts %s but excludes non-red Events and low-cost Characters",
    (selectedCard) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP12-001",
          character: ["OP13-066", "EB01-005"],
          hand: ["OP12-017"],
          deck: ["OP12-019", "OP12-009", "OP06-056", "EB01-005", "EB01-025"],
          activeDon: 5,
        },
        {},
      );

      engine.playCard("OP12-017");
      engine.acceptLeadingOptional("south");
      // Pay the give-DON cost: pick Rayleigh as the recipient.
      const donCost = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
      if (donCost?.kind !== "payCost") throw new Error("Expected the DON recipient cost.");
      expect(
        donCost.candidates
          .filter((c) => c.legal)
          .map((c) => c.ref.id)
          .sort(),
      ).toEqual(
        [engine.leader("south"), engine.findCardInZone("south", "character", "OP13-066")].sort(),
      );
      const rayleighCostId = donCost.candidates.find(
        (candidate) => candidate.publicInfo?.cardId === "OP13-066",
      );
      if (!rayleighCostId) throw new Error("Expected Rayleigh as recipient candidate.");
      engine.resolveDecision(
        "effectCostGiveDon",
        { selectedIds: [rayleighCostId.ref.id!] },
        "south",
      );
      const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
      if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
      const eligible = ["OP12-019", "OP12-009"].map((cardId) =>
        engine.findCardInZone("south", "deck", cardId),
      );
      expect(
        search.candidates
          .filter((c) => c.legal)
          .map((c) => c.ref.id)
          .sort(),
      ).toEqual(eligible.sort());
      const selectedId = engine.findCardInZone("south", "deck", selectedCard);
      engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

      const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
      engine.resolveDecision(
        "effectSearchRemainderOrder",
        { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
        "south",
      );

      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
        selectedCard,
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("[Main] declined looks at nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: ["OP13-066"],
        hand: ["OP12-017"],
        deck: ["OP16-004", "OP15-019", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      {},
    );

    engine.playCard("OP12-017");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").players.south.deckCount).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("excludes a non-red Character costing at least three under the official FAQ", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "OP12-001",
      hand: ["OP12-017"],
      activeDon: 1,
      deck: ["OP12-036", "OP12-009", "OP12-019", "EB01-005", "EB01-025"],
    });
    engine.asSouth().play("OP12-017");
    engine.asSouth().acceptOptional();
    const step = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected search");
    const wrong = engine.findCardInZone("south", "deck", "OP12-036");
    expect(step.candidates.find((c) => c.ref.id === wrong)?.legal).toBe(false);
    const valid = engine.findCardInZone("south", "deck", "OP12-009");
    expect(step.candidates.find((c) => c.ref.id === valid)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [valid] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected remainder order");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((c) => c.ref.id) },
      "south",
    );
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([valid]);
  });
});
