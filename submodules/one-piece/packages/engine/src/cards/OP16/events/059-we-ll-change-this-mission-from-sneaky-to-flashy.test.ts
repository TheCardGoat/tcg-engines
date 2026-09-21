import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-059 We'll Change This Mission From Sneaky to Flashy", () => {
  test("[Main] resting 7 DON!! looks at 5 and plays up to 2 Impel Down Characters of 6000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-059"],
        deck: ["OP16-042", "OP13-013", "OP16-024", "OP13-013", "OP13-013"],
        activeDon: 8,
      },
      {},
    );

    engine.playCard("OP16-059");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal).toHaveLength(2);
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: legal.map((candidate) => candidate.ref.id) },
      "south",
    );

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const chars = engine.getView("south").players.south.characters.map((c) => c?.cardId);
    expect(chars).toContain("OP16-042");
    expect(chars).toContain("OP16-024");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-059"], activeDon: 3 }, {});

    engine.playCard("OP16-059");
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-059");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] decline path (subject-bound)", () => {
    const flashy = "OP16-059";
    const engine = OnePieceTestEngine.create({ hand: [flashy], activeDon: 9 }, {});
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(flashy);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((c) => c.cardId)).toContain(flashy);
    expect(south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
