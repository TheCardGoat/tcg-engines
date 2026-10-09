import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-010 Lulucia Kingdom", () => {
  test("[On Play] sets opposing power to 0 only for this turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-010"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    const target = engine.findCardInZone("north", "character", "OP13-013");
    engine.playCard("EB04-010");
    engine.acceptLeadingOptional("south");
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [drop.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.stage?.cardId).toBe("EB04-010");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(0);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined sets no power to 0", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-010"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const before = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId)?.power;

    engine.playCard("EB04-010");
    // The "up to 1" target selection IS the decline point.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const after = engine
      .getView("south")
      .players.north.characters.find((c) => c?.instanceId === higumaId);
    expect(after?.power).toBe(before);
    expect(engine.getView("south").players.south.stage?.cardId).toBe("EB04-010");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("opponent-turn bonus applies to every base-cost-1 Character but not base cost 2", () => {
    const engine = OnePieceTestEngine.create({
      stage: "EB04-010",
      character: ["EB01-005", "OP13-013", "ST01-002"],
    });
    const powers = () =>
      engine
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c?.power);
    expect(powers()).toEqual([3000, 3000, 2000]);
    engine.endTurn("south");
    expect(powers()).toEqual([8000, 8000, 2000]);
    engine.endTurn("north");
    expect(powers()).toEqual([3000, 3000, 2000]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("the aura excludes base-cost-six Crocus after its current cost becomes one", () => {
    const e = OnePieceTestEngine.create(
      { stage: "EB04-010", character: ["EB01-005", "EB01-041"] },
      { hand: ["OP02-117"], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const crocus = e.findCardInZone("south", "character", "EB01-041");
    const before = e.getView("south").players.south.characters[1]?.power;
    e.playCard("OP02-117", "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [crocus] }, "north");
    const view = e.getView("south");
    expect(view.players.south.characters[0]?.power).toBe(8000);
    expect(view.players.south.characters[1]?.cost).toBe(1);
    expect(view.players.south.characters[1]?.power).toBe(before);
    expect(view.prompts).toHaveLength(0);
  });
});
