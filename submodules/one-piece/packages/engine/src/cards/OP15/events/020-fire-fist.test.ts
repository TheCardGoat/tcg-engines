import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-020 Fire Fist", () => {
  test("[Main] boosts the Leader, drops an opposing Character, and may K.O. it after trashing 2", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-020", "EB01-005", "OP16-004", "OP13-013"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const base = engine.getView("south").players.south.leader?.power ?? 0;
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-020");

    // Leader +3000 this turn; then drop an opposing Character by -8000.
    expect(engine.getView("south").players.south.leader?.power).toBe(base + 3000);
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the -8000 target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(-5000);

    // Optional: trash 2 from hand to K.O. the dropped Character.
    engine.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash cost.");
    const handIds = engine
      .getView("south")
      .players.south.hand.flatMap((card) => (card.instanceId ? [card.instanceId] : []));
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: handIds.slice(0, 2) },
      "south",
    );
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      higumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the trash leaves the opposing Character alive", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-020", "EB01-005", "OP16-004", "OP13-013"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-020");
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the -8000 target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");
    engine.resolveDecision("effectActionOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(-5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: may trash the only hand card without performing the dependent K.O.", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-020", "ST02-002"], activeDon: 7 },
      { character: ["OP13-013"] },
    );
    const target = e.findCardInZone("north", "character", "OP13-013");
    e.playCard("OP15-020");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(-5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("with no hand cards, accepting the discard cannot K.O. the weakened Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-020"], activeDon: 7 },
      { character: ["OP13-013"] },
    );
    const target = e.findCardInZone("north", "character", "OP13-013");
    e.playCard("OP15-020");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(-5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
