import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Ball015 } from "./015-ball.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Ball (GD01-015)", () => {
  it("offers friendly Units and recovers 1 HP from the Unit chosen when Ball attacks", () => {
    const ally = createMockUnit({ hp: 4 });
    const damageDefender = createMockUnit({ ap: 2, hp: 10 });
    const ballDefender = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd01Ball015, ally],
        baseSection: [createMockBase({ hp: 20 })],
        deck: 5,
      },
      { play: [damageDefender, ballDefender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [ballId, allyId] = p1.getCardsInZone("battleArea");
    const [damageDefenderId, ballDefenderId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [damageDefenderId!, ballDefenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, allyId!, damageDefenderId!);
    expectSuccess(p1.enterBattle(ballId!, ballDefenderId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([ballId, allyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId!] }));

    expect(p1.getDamage(allyId!)).toBe(1);
  });
});
