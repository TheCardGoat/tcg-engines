import { describe, expect, test } from "vite-plus/test";
import { op02Blenheim012, op02Dogura010, op02Magura016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-016 Magura", () => {
  test("gives an own red cost-1 Character +3000 power for this turn only", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Magura016],
        character: [
          { card: op02Dogura010, playedOnTurn: 0 },
          { card: op02Blenheim012, playedOnTurn: 0 },
        ],
        activeDon: op02Magura016.cost,
      },
      {
        character: [{ card: op02Dogura010, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownDoguraId = engine.findCardInZone("south", "character", op02Dogura010);
    const wrongCostId = engine.findCardInZone("south", "character", op02Blenheim012);
    const opposingDoguraId = engine.findCardInZone("north", "character", op02Dogura010);

    engine.playCard(op02Magura016, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Magura's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(ownDoguraId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingDoguraId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownDoguraId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ownDoguraId)?.power,
    ).toBe(5000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ownDoguraId)?.power,
    ).toBe(2000);
  });
});
