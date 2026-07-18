import { describe, expect, test } from "vite-plus/test";
import { op08CharlotteCracker064, op09Bepo074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-074 Bepo", () => {
  test("once per turn gives an own target +1000 when own DON!! returns, then expires", () => {
    const engine = OnePieceTestEngine.create({
      character: [op09Bepo074, op08CharlotteCracker064, op08CharlotteCracker064],
      activeDon: 2,
    });
    const bepoId = engine.findCardInZone("south", "character", op09Bepo074);
    const crackerIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op08CharlotteCracker064.id)
      .map((card) => card!.instanceId);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(crackerIds[0]!, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Bepo's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(bepoId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(
      engine.leader("south"),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bepoId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === bepoId)
        ?.power,
    ).toBe(3000);
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 1);

    engine.activateEffect(crackerIds[1]!, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const afterSecondReturn = engine.getView("south");
    expect(afterSecondReturn.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(
      afterSecondReturn.players.south.characters.find((card) => card?.instanceId === bepoId)?.power,
    ).toBe(3000);
    expect(afterSecondReturn.prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === bepoId)
        ?.power,
    ).toBe(2000);
  });
});
