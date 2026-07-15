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
import { gd01Skygrasper079 } from "./079-skygrasper.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Skygrasper (GD01-079)", () => {
  it("deploys with visible stats, links with an Earth Alliance Pilot, and attacks this turn", () => {
    const earthAlliancePilot = createMockPilot({ traits: ["earth alliance"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Skygrasper079, earthAlliancePilot],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01Skygrasper079));
    const skygrasperId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(skygrasperId)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
    expectSuccess(p1.assignPilot(earthAlliancePilot, skygrasperId));

    expectSuccess(p1.enterBattle(skygrasperId, enemyId));
  });
});
