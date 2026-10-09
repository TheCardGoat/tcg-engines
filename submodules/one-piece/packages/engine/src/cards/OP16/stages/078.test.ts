import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-078 Marineford", () => {
  test("[On Play] looks at 5 and takes a Navy card to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-078", "EB01-005"],
        deck: ["OP16-063", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-078");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((c) => c.publicInfo?.cardId)).toEqual(["OP16-063"]);
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

    expect(engine.getView("south").players.south.hand.map((c) => c.cardId)).toContain("OP16-063");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate:Main] declined keeps the Stage in play", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-078", "EB01-005"], activeDon: 8 }, {});

    engine.playCard("OP16-078");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((c) => c.ref.id).reverse() },
      "south",
    );
    engine.activateEffect(
      engine.getView("south").players.south.stage!.instanceId!,
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP16-078");
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).not.toContain(
      "OP16-078",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("activation returns DON and rests the Stage before drawing and discarding", () => {
    const e = OnePieceTestEngine.create({
      stage: "OP16-078",
      hand: ["ST02-002"],
      deck: ["ST02-003", "ST02-002"],
      activeDon: 2,
    });
    const stage = e.findCardInZone("south", "stage", "OP16-078");
    const donDeck = e.getView("south").players.south.donDeckCount;
    e.activateEffect(stage, "activateMain", "south");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").players.south.donDeckCount).toBe(donDeck + 1);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
      "ST02-002",
      "ST02-003",
    ]);
    e.asSouth().trashFromHand("ST02-002");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-003"]);
    expect(() => e.activateEffect(stage, "activateMain", "south")).toThrow();
  });
});
