import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01GquuuuuuxOmegaPsycommu024 } from "./024-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (EB01-024)", () => {
  it("<Breach 3> deals exactly 3 damage after destroying a Unit in battle", () => {
    expectBreachAbility(eb01GquuuuuuxOmegaPsycommu024, 3);
  });

  it("【Attack】 exposes only enemy Lv.5-or-lower <Blocker> Units and deals them 2 damage", () => {
    const eligible = createMockUnit({ level: 5, hp: 4, keywordEffects: [{ keyword: "Blocker" }] });
    const highLevel = createMockUnit({ level: 6, keywordEffects: [{ keyword: "Blocker" }] });
    const noBlocker = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { play: [eb01GquuuuuuxOmegaPsycommu024] },
      { play: [eligible, highLevel, noBlocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, highLevelId, noBlockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getDamage(eligibleId!)).toBe(2);
    expect(p2.getDamage(highLevelId!)).toBe(0);
    expect(p2.getDamage(noBlockerId!)).toBe(0);
  });
});
