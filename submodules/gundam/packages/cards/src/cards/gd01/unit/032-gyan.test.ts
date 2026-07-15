import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Gyan032 } from "./032-gyan.ts";

describe("Gyan (GD01-032)", () => {
  it("can attack on its deploy turn with M'Quve and offers only enemy Blockers at Lv.2 or lower", () => {
    const mQuve = createMockPilot({ name: "M'Quve", traits: ["zeon"], level: 1, cost: 1 });
    const legalBlocker = createMockUnit({
      level: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const highBlocker = createMockUnit({
      level: 3,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const directShield = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd01Gyan032, mQuve], resourceArea: activeResources(4) },
      { play: [legalBlocker, highBlocker], shieldArea: [directShield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [legalBlockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01Gyan032));
    expectSuccess(p1.assignPilot(mQuve, gd01Gyan032));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [legalBlockerId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [legalBlockerId!] }));
    expectSuccess(p1.enterBattle(gd01Gyan032, "direct"));

    expect(p2.getCardZone(legalBlockerId!)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("does not trigger when paired with a Pilot outside the Zeon trait", () => {
    const pilot = createMockPilot({ traits: ["earth federation"], level: 1, cost: 1 });
    const blocker = createMockUnit({
      level: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { hand: [pilot], play: [gd01Gyan032], resourceArea: activeResources(4) },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, gd01Gyan032));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(blockerId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
