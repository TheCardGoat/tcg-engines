import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-042", () => {
  test("[On Play] trashes 3 deck cards and gives an opposing Character +1 cost", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-042"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const costBefore = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId)?.cost;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard("EB04-042");
    engine.acceptLeadingOptional("south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the cost boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const boosted = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(boosted?.cost).toBe((costBefore ?? 0) + 1);
    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined leaves the deck and opposing costs untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-042"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const costBefore = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId)?.cost;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard("EB04-042");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const boosted = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(boosted?.cost).toBe(costBefore);
    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
