import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04AthrunZala011 } from "../../st04/pilot/011-athrun-zala.ts";
import { gd03JusticeGundamMeteor077 } from "./077-justice-gundam-meteor.ts";

describe("Justice Gundam (METEOR) (GD03-077)", () => {
  it("【When Linked】 returns 1 to 3 enemy Units with 3 or less HP to hand", () => {
    const weakA = createMockUnit({ hp: 3 });
    const weakB = createMockUnit({ hp: 3 });
    const weakC = createMockUnit({ hp: 3 });
    const sturdy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [st04AthrunZala011],
        play: [gd03JusticeGundamMeteor077],
        resourceArea: activeResources(8),
      },
      { play: [weakA, weakB, weakC, sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [weakAId, weakBId, weakCId, sturdyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(st04AthrunZala011, unitId));

    const ordering = p1.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") throw new Error("Expected When Linked ordering");
    const justiceEffect = ordering.candidates.find(
      (candidate) => candidate.sourceCardId === unitId,
    );
    expectSuccess(p1.resolveEffect({ pendingEffectId: justiceEffect!.effectId }));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([weakAId, weakBId, weakCId]),
      minTargets: 1,
      maxTargets: 3,
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.legalTargetIds).not.toContain(sturdyId);
    expectSuccess(p1.resolveEffect({ targets: [weakAId!, weakBId!, weakCId!] }));

    expect(p2.getHand()).toEqual(expect.arrayContaining([weakAId, weakBId, weakCId]));
    expect(p2.getCardsInZone("battleArea")).toContain(sturdyId);
  });

  it("does not return enemy Units while paired but not linked", () => {
    const wrongPilot = createMockPilot({ name: "Kira Yamato", cost: 1 });
    const weakA = createMockUnit({ hp: 3 });
    const weakB = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        play: [gd03JusticeGundamMeteor077],
        resourceArea: activeResources(8),
      },
      { play: [weakA, weakB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [weakAId, weakBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(wrongPilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toEqual([weakAId, weakBId]);
    expect(p2.getHand()).toHaveLength(0);
  });
});
