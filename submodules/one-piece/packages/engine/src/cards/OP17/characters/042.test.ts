import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-042 Kaido", () => {
  test("reveals three Rocks Pirates cards to reduce opposing power for this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-042", "OP17-040", "OP17-048", "OP17-052", "OP17-044", "EB01-005"],
        activeDon: 4,
      },
      { character: ["OP13-013"] },
    );
    const target = engine.findCardInZone("north", "character", "OP13-013");
    const before = engine.getView("south").players.north.characters[0]!.power!;
    engine.playCard("OP17-042");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (reveal?.kind !== "payCost") throw new Error("Expected reveal cost");
    const ids = ["OP17-040", "OP17-048", "OP17-052"].map((id) =>
      engine.findCardInZone("south", "hand", id),
    );
    expect(reveal.candidates.map((card) => card.ref.id)).toEqual([
      ...ids,
      engine.findCardInZone("south", "hand", "OP17-044"),
    ]);
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: ids }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(before - 3000);
    expect(engine.getView("south").players.south.hand).toHaveLength(5);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    engine.endTurn("south");
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(before);
  });

  test("cannot pay with only two Rocks Pirates cards and a wrong-trait card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-042", "OP17-040", "OP17-048", "EB01-005"], activeDon: 4 },
      { character: ["OP13-013"] },
    );
    const before = engine.getView("south").players.north.characters[0]!.power;
    engine.playCard("OP17-042");
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(before);
    expect(engine.getView("south").players.south.hand).toHaveLength(3);
  });

  test("can decline revealing and still block an attack", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-042", "OP17-040", "OP17-048", "OP17-052"], activeDon: 4 },
      {},
    );
    engine.playCard("OP17-042");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.hand).toHaveLength(3);
    engine.endTurn("south");
    const life = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision(
      "battleBlocker",
      { selectedIds: [engine.findCardInZone("south", "character", "OP17-042")] },
      "south",
    );
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(engine.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
