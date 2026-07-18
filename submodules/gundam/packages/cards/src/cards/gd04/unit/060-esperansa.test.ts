import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd02AwakenedPower110 } from "../../gd02/command/110-awakened-power.ts";
import { gd04Esperansa060 } from "./060-esperansa.ts";

describe("Esperansa (GD04-060)", () => {
  it("draws 1 when deployed from trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      trash: [gd04Esperansa060],
      resourceArea: activeResources(6),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const esperansaId = p1.getCardsInZone("trash")[0]!;
    const handBefore = p1.getCardsInZone("hand").length;

    expectSuccess(p1.playCommand(gd02AwakenedPower110));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible trash Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([esperansaId]);
    expectSuccess(p1.resolveEffect({ targets: [esperansaId] }));

    expect(p1.getCardsInZone("battleArea")).toContain(esperansaId);
    expect(p1.getCardsInZone("hand").length).toBe(handBefore);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
  });

  it("does not draw when deployed from hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Esperansa060],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd04Esperansa060));

    expect(p1.getCardsInZone("hand")).toHaveLength(0);
    expect(p1.getCardsInZone("deck")).toHaveLength(5);
  });
});
