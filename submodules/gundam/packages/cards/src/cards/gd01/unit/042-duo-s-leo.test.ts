import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01DuoSLeo042 } from "./042-duo-s-leo.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Duo's Leo (GD01-042)", () => {
  it("can attack on its deploy turn with Duo Maxwell and may choose an active enemy Lv.2 Unit", () => {
    const duo = createMockPilot({ name: "Duo Maxwell", level: 1, cost: 1 });
    const activeLv2 = createMockUnit({ level: 2, hp: 5 });
    const activeLv3 = createMockUnit({ level: 3, hp: 5 });
    const restedLv5 = createMockUnit({ level: 5, ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01DuoSLeo042, duo],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [activeLv2, activeLv3, restedLv5], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [activeLv2Id, activeLv3Id, restedLv5Id] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [restedLv5Id!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01DuoSLeo042));
    expectSuccess(p1.assignPilot(duo, gd01DuoSLeo042));
    expect(p1.getLegalAttackTargets(gd01DuoSLeo042)).toEqual(
      expect.arrayContaining(["direct", activeLv2Id, restedLv5Id]),
    );
    expect(p1.getLegalAttackTargets(gd01DuoSLeo042)).not.toContain(activeLv3Id);
    expectSuccess(p1.enterBattle(gd01DuoSLeo042, activeLv2Id!));
  });

  it("rejects an active enemy Unit above Lv.2", () => {
    const enemy = createMockUnit({ level: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [gd01DuoSLeo042] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const duoLeoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(duoLeoId, enemyId), "INVALID_TARGET");
  });
});
