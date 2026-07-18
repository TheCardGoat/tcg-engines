import { describe, expect, test } from "vite-plus/test";
import { op11Jinbe021, op11Jinbe031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-021 Jinbe", () => {
  test("reactivates an included Merfolk Character and one DON!! at six cards or less", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Jinbe021,
      character: [{ card: op11Jinbe031, rested: true, playedOnTurn: 0 }],
      restedDon: 2,
    });
    const jinbeId = engine.findCardInZone("south", "character", op11Jinbe031);

    engine.endTurn("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [jinbeId] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
