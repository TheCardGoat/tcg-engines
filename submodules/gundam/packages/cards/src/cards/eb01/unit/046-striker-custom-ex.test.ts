import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01StrikerCustomEx046 } from "./046-striker-custom-ex.ts";

describe("Striker Custom (EX) (EB01-046)", () => {
  it("【During Pair】【Attack】 gives AP-2 only to a chosen enemy Unit at Lv.4 or higher", () => {
    const pilot = createMockPilot();
    const eligible = createMockUnit({ level: 4, ap: 5 });
    const ineligible = createMockUnit({ level: 3, ap: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [eb01StrikerCustomEx046],
        resourceArea: activeResources(1),
      },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(pilot, sourceId));

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getVisibleCard(eligibleId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(ineligibleId!)?.effectiveAp).toBe(5);
  });

  it("does not create a target choice while it is unpaired", () => {
    const eligible = createMockUnit({ level: 4, ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01StrikerCustomEx046], shieldArea: [createMockUnit()] },
      { play: [eligible], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
