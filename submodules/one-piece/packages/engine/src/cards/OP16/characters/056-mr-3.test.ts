import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-056 Mr.3", () => {
  test("[Activate: Main] trashing itself draws 2 and may stop an opposing Character from attacking", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-056"], hand: ["EB01-005"], activeDon: 4 },
      { character: [{ cardId: "OP16-004", attachedDon: 1 }], activeDon: 5 },
    );
    const mr3Id = engine.findCardInZone("south", "character", "OP16-056");
    const curielId = engine.findCardInZone("north", "character", "OP16-004");

    engine.activateEffect(mr3Id, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the cannot-attack target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [curielId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(mr3Id);
    expect(south.hand).toHaveLength(3);

    // The frozen Character cannot attack on the opponent's next turn.
    engine.endTurn("south");
    expect(() => engine.asNorth().attack("OP16-004", engine.asSouth().leader())).toThrow();
  });

  test("declining trashes nothing", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-056"], hand: ["EB01-005"], activeDon: 4 },
      {},
    );
    const mr3Id = engine.findCardInZone("south", "character", "OP16-056");

    engine.activateEffect(mr3Id, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.instanceId)).toContain(mr3Id);
    expect(south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
