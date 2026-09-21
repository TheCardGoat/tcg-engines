import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-017 Color of Observation Haki", () => {
  test("[Main] giving a DON!! to a [Silvers Rayleigh] looks at 4 and takes a red Event", () => {
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
    engine.acceptLeadingOptional("south");
    // Pay the give-DON cost: pick Rayleigh as the recipient.
    const donCost = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    if (donCost?.kind !== "payCost") throw new Error("Expected the DON recipient cost.");
    const rayleighCostId = donCost.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP13-066",
    );
    if (!rayleighCostId) throw new Error("Expected Rayleigh as recipient candidate.");
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [rayleighCostId.ref.id!] }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const ginCandidate = search.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP15-019",
    );
    if (!ginCandidate) throw new Error("Expected the red Event candidate.");
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [ginCandidate.ref.id!] },
      "south",
    );

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP15-019",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

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
});
