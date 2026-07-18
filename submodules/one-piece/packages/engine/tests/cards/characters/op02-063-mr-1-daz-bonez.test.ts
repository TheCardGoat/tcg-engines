import { describe, expect, test } from "vite-plus/test";
import {
  op02ArabesqueBrickFist067,
  op02ImpelDownAllStars066,
  op02Mohji060,
  op02Mr1DazBonez063,
  op02Seaquake021,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-063 Mr.1 (Daz.Bonez)", () => {
  test("returns only a blue cost-1 Event from trash to hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Mr1DazBonez063],
      trash: [op02ImpelDownAllStars066, op02Seaquake021, op02ArabesqueBrickFist067, op02Mohji060],
      activeDon: 1,
    });
    const eligible = engine.findCardInZone("south", "trash", op02ImpelDownAllStars066);
    const redEvent = engine.findCardInZone("south", "trash", op02Seaquake021);
    const wrongCostEvent = engine.findCardInZone("south", "trash", op02ArabesqueBrickFist067);
    const nonEvent = engine.findCardInZone("south", "trash", op02Mohji060);

    engine.playCard(op02Mr1DazBonez063, "south");

    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") throw new Error("Expected trash choice.");
    const candidateIds = choice.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toEqual([eligible]);
    expect(candidateIds).not.toContain(redEvent);
    expect(candidateIds).not.toContain(wrongCostEvent);
    expect(candidateIds).not.toContain(nonEvent);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligible] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eligible,
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([redEvent, wrongCostEvent, nonEvent]),
    );
  });
});
