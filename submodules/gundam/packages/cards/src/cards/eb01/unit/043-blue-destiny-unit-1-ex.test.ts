import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01BlueDestinyUnit1Ex043 } from "./043-blue-destiny-unit-1-ex.ts";

describe("Blue Destiny Unit-1 (EX) (EB01-043)", () => {
  it("【Attack】 with a friendly Blocker gives AP-2 only to an enemy Unit at Lv.5 or lower", () => {
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const eligible = createMockUnit({ level: 5, ap: 5 });
    const ineligible = createMockUnit({ level: 6, ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01BlueDestinyUnit1Ex043, blocker] },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getVisibleCard(eligibleId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(ineligibleId!)?.effectiveAp).toBe(5);
  });

  it("does not trigger without another friendly Unit with Blocker", () => {
    const enemy = createMockUnit({ level: 5, ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01BlueDestinyUnit1Ex043] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
  });
});
