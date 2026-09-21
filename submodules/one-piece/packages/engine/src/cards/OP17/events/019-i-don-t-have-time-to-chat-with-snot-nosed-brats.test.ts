import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-019 I Don't Have Time to Chat With Snot-Nosed Brats", () => {
  test("[Main] looks at 5 and takes a Whitebeard Pirates card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-019"],
        deck: ["OP13-013", "OP16-003", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP17-019");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP16-003"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-003");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] resolves and moves to trash", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-019"], activeDon: 3 }, {});

    engine.playCard("OP17-019");
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

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-019");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
