import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05SaintCharlos084 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const FILLER = "OP16-096";

describe("OP13-079 Imu", () => {
  test("[Activate: Main] trashes a hand card to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        hand: [FILLER, eb01Doma005],
        deck: [FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const trashBefore = engine.getView("south").players.south.trash.length;
    const handId = engine.findCardInZone("south", "hand", FILLER);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashCard", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Imu's trash cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(handId);
    engine.resolveDecision("effectCostTrashCard", { selectedIds: [handId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.map((card) => card.instanceId)).toContain(handId);
    expect(view.trash).toHaveLength(trashBefore + 1);
    expect(view.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] alternatively trashes a {Celestial Dragons} Character to draw 1 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        character: [{ card: op05SaintCharlos084, rested: true }],
        deck: [FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const charlosId = engine.findCardInZone("south", "character", op05SaintCharlos084);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // Charlos is the only legal cost, so the engine auto-pays without a prompt.
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(charlosId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("activates only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        hand: [FILLER, FILLER],
        deck: [FILLER, FILLER, FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const leaderId = engine.leader("south");

    engine.activateEffect(leaderId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashCard", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Imu's trash cost.");
    engine.resolveDecision(
      "effectCostTrashCard",
      { selectedIds: [payment.candidates[0]!.ref.id] },
      "south",
    );

    expect(() => engine.activateEffect(leaderId, "activateMain", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the activation leaves hand, field, and trash unchanged", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-079",
        hand: [FILLER, FILLER],
        deck: [FILLER, FILLER],
        activeDon: 5,
      },
      {},
    );
    const before = engine.getView("south").players.south;
    const trashBefore = before.trash.length;
    const handBefore = before.hand.length;
    const deckBefore = before.deckCount;

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.hand).toHaveLength(handBefore);
    expect(after.trash).toHaveLength(trashBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is rejected with neither a {Celestial Dragons} Character nor a hand card", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP13-079", activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
