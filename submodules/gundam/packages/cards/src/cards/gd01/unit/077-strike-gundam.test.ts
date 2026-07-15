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
import { gd01StrikeGundam077 } from "./077-strike-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Strike Gundam (GD01-077)", () => {
  it("deploys with visible stats, links with Kira Yamato, and attacks this turn", () => {
    const kira = createMockPilot({ name: "Kira Yamato", level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrikeGundam077, kira],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01StrikeGundam077));
    const strikeId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(strikeId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    expect(p1.getCardZone(strikeId)).toBe(`battleArea:${PLAYER_ONE}`);
    expectSuccess(p1.assignPilot(kira, strikeId));

    expectSuccess(p1.enterBattle(strikeId, enemyId));
  });
});
