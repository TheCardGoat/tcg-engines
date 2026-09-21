import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-021 Moby Dick", () => {
  test("[On Play] with a Whitebeard Leader resolves and places the Stage", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-001",
        hand: ["OP16-021", "EB01-005"],
        deck: ["OP16-004", "OP13-013", "OP13-013"],
        activeDon: 8,
      },
      {},
    );

    engine.playCard("OP16-021");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    if (legal.length > 0) {
      engine.resolveDecision(
        "effectSearchSelection",
        { selectedIds: [legal[0]!.ref.id!] },
        "south",
      );
    } else {
      engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    }
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.stage).toBeTruthy();
  });

  test("[Activate:Main] declined keeps the Stage in play", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-001", hand: ["OP16-021", "EB01-005"], activeDon: 8 },
      {},
    );

    engine.playCard("OP16-021");
    // The On Play search fires for the Whitebeard Leader: decline it.
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const playOrder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (playOrder?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: playOrder.candidates.map((c) => c.ref.id).reverse() },
      "south",
    );
    engine.activateEffect(
      engine.getView("south").players.south.stage!.instanceId!,
      "activateMain",
      "south",
    );
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (gate?.extensions?.resolutionIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    }

    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP16-021");
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).not.toContain(
      "OP16-021",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
