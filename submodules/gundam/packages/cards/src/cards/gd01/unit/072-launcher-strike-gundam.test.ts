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
import { gd01LauncherStrikeGundam072 } from "./072-launcher-strike-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Launcher Strike Gundam (GD01-072)", () => {
  it("uses Blocker to visibly intercept an attack", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [attacker],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender, gd01LauncherStrikeGundam072] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.declareBlock(blockerId!));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(blockerId);
  });

  it("links with an Earth Alliance Pilot and can attack on the deployment turn", () => {
    const earthAlliancePilot = createMockPilot({ traits: ["earth alliance"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01LauncherStrikeGundam072, earthAlliancePilot],
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

    expectSuccess(p1.deployUnit(gd01LauncherStrikeGundam072));
    const launcherId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(earthAlliancePilot, launcherId));

    expectSuccess(p1.enterBattle(launcherId, enemyId));
  });
});
