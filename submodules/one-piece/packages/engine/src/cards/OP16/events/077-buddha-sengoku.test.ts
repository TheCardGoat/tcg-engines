import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-077 Buddha Sengoku", () => {
  test("[Main] looks at 5, may take a Navy card, orders the rest, then trashes 1 from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-077", "EB01-005"],
        deck: ["OP13-013", "OP16-063", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-077");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP16-063"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-063");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] resolves and moves to trash", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-077"], activeDon: 3 }, {});

    engine.playCard("OP16-077");
    for (let i = 0; i < 3; i++) {
      const pending = engine.getView("south").decisions?.[0] as
        | { extensions?: { resolutionIntent?: string } }
        | undefined;
      if (!pending?.extensions?.resolutionIntent) break;
      for (let i = 0; i < 3; i++) {
        const pending = engine.getView("south").decisions?.[0] as
          | { extensions?: { resolutionIntent?: string } }
          | undefined;
        if (!pending?.extensions?.resolutionIntent) break;
        const intent = pending.extensions.resolutionIntent;
        try {
          const step = engine.pendingDecision(intent as never, "south").steps[0];
          if (step?.kind === "selectEntity" || step?.kind === "orderItems") {
            engine.resolveDecision(intent as never, { selectedIds: [] }, "south");
          } else if (step?.kind === "chooseOption") {
            engine.resolveDecision(intent as never, { optionId: "0" }, "south");
          } else break;
        } catch {
          break;
        }
      }
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-077");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
