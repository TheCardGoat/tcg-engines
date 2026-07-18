import { describe, expect, test } from "vite-plus/test";
import { op07TonyTonyChopper066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-066 Tony Tony.Chopper", () => {
  test("adds an optional rested DON!! at parity, then blocks an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07TonyTonyChopper066],
        activeDon: op07TonyTonyChopper066.cost,
      },
      { activeDon: 2 },
    );

    engine.playCard(op07TonyTonyChopper066, "south");
    const chopperId = engine.findCardInZone("south", "character", op07TonyTonyChopper066);
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Chopper's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Chopper's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(chopperId);
    engine.resolveDecision("battleBlocker", { selectedIds: [chopperId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(chopperId);
    expect(view.prompts).toHaveLength(0);
  });
});
