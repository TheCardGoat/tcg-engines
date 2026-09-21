import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-084 Kouzuki Momonosuke", () => {
  test("cannot trash itself while its cost is below 20", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP16-084"], activeDon: 9 }, {});
    const momoId = engine.findCardInZone("south", "character", "OP16-084");

    // The cost-20 gate rejects the whole activation.
    expect(() => engine.activateEffect(momoId, "activateMain", "south")).toThrow();

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      momoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("after Shinobu raises its cost it may trash itself to play a cost-9 [Kouzuki Momonosuke] from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-031",
        character: ["OP16-084"],
        hand: ["OP16-087"],
        trash: ["OP16-085"],
        activeDon: 11,
      },
      {},
    );
    const momoId = engine.findCardInZone("south", "character", "OP16-084");

    engine.playCard("OP16-087");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the +20 cost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [momoId] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === momoId)?.cost,
    ).toBe(25);

    engine.activateEffect(momoId, "activateMain", "south");
    engine.acceptLeadingOptional("south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );
    // The played Momonosuke's own On Play targets nothing available: decline it.
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(momoId);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-085");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] with cost 20 or more may be declined", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-031",
        character: ["OP16-084"],
        hand: ["OP16-087"],
        trash: ["OP16-085"],
        activeDon: 11,
      },
      {},
    );
    const momoId = engine.findCardInZone("south", "character", "OP16-084");

    // Shinobu raises the cost past 20 so the activation becomes legal.
    engine.playCard("OP16-087");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the +20 cost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [momoId] }, "south");

    engine.activateEffect(momoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.instanceId)).toContain(momoId);
    expect(south.trash.map((card) => card.instanceId)).not.toContain(momoId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
