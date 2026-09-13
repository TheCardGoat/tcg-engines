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
import { expectSuppressionAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01PsychoZakuEx045 } from "./045-psycho-zaku-ex.ts";

describe("Psycho Zaku (EX) (EB01-045)", () => {
  it("<Suppression> destroys the first 2 Shields in one direct attack", () => {
    expectSuppressionAbility(eb01PsychoZakuEx045);
  });

  it("【When Paired】 exposes only an enemy Unit with <Repair> and returns it to hand", () => {
    const pilot = createMockPilot({ name: "Daryl Lorenz", level: 0, cost: 0 });
    const repairUnit = createMockUnit({ keywordEffects: [{ keyword: "Repair", value: 1 }] });
    const otherUnit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [pilot], play: [eb01PsychoZakuEx045], resourceArea: activeResources(1) },
      { play: [repairUnit, otherUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [repairId, otherId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, sourceId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [repairId],
    });
    expectSuccess(p1.resolveEffect({ targets: [repairId!] }));

    expect(p2.getCardZone(repairId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(otherId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
