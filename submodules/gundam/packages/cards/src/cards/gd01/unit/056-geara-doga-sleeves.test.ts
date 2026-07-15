import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GearaDogaSleeves056 } from "./056-geara-doga-sleeves.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function completeBattle(
  attacker: ReturnType<GundamTestEngine["asPlayer"]>,
  defender: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(defender.passBlock());
  expectSuccess(defender.passBattleAction());
  expectSuccess(attacker.passBattleAction());
}

describe("Geara Doga (Sleeves) (GD01-056)", () => {
  it("offers only enemy Units with 5 or less AP after it is destroyed in battle", () => {
    const eligibleAttacker = createMockUnit({ ap: 3, hp: 6 });
    const tooStrong = createMockUnit({ ap: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [eligibleAttacker, tooStrong],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [gd01GearaDogaSleeves056] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleAttackerId, tooStrongId] = p1.getCardsInZone("battleArea");
    const gearaDogaId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [gearaDogaId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(eligibleAttackerId!, gearaDogaId));
    completeBattle(p1, p2);

    expect(p2.getCardZone(gearaDogaId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleAttackerId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p2.resolveEffect({ targets: [eligibleAttackerId!] }));

    expect(p1.getDamage(eligibleAttackerId!)).toBe(3);
    expect(p1.getDamage(tooStrongId!)).toBe(0);
  });

  it("does not open a target prompt when every enemy Unit has more than 5 AP", () => {
    const attacker = createMockUnit({ ap: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [attacker],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [gd01GearaDogaSleeves056] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const gearaDogaId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [gearaDogaId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(attackerId, gearaDogaId));
    completeBattle(p1, p2);

    expect(p2.getCardZone(gearaDogaId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getDamage(attackerId)).toBe(2);
  });
});
