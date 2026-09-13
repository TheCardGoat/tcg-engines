import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01Darilbalde036 } from "./036-darilbalde.ts";

describe("Darilbalde (EB01-036)", () => {
  /** @behavioral-proof complete: turn gate plus friendly, other, trait, and exact-level targeting. */
  it("gives only other friendly Lv.3 G Generation Units AP+1 during its turn", () => {
    const eligible = createMockUnit({ level: 3, ap: 2, traits: ["g generation"] });
    const wrongLevel = createMockUnit({ level: 4, ap: 2, traits: ["g generation"] });
    const enemy = createMockUnit({ level: 3, ap: 2, traits: ["g generation"] });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01Darilbalde036],
        play: [eligible, wrongLevel],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId, wrongLevelId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01Darilbalde036));

    expect(p1.getVisibleCard(eligibleId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(wrongLevelId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
  });
});
