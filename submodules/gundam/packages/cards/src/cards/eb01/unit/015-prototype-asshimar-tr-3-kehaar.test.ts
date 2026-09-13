import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { eb01PrototypeAsshimarTr3Kehaar015 } from "./015-prototype-asshimar-tr-3-kehaar.ts";

describe("Prototype Asshimar TR-3 [Kehaar] (EB01-015)", () => {
  it("【Destroyed】 with two other rested Units deals 1 to one chosen rested enemy Unit", () => {
    const attacker = createMockUnit({ ap: 10, hp: 10 });
    const target = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01PrototypeAsshimarTr3Kehaar015], deck: 3, shieldArea: [createMockUnit()] },
      {
        play: [attacker, { card: target, exhausted: true }],
        deck: 3,
        shieldArea: [createMockUnit()],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, targetId] = p2.getCardsInZone("battleArea");
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [sourceId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [targetId!]);

    expectSuccess(p2.enterBattle(attackerId!, sourceId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const attackerDamageBeforeAbility = p2.getDamage(attackerId!);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([attackerId, targetId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p2.getDamage(targetId!)).toBe(1);
    expect(p2.getDamage(attackerId!)).toBe(attackerDamageBeforeAbility);
  });

  it("does not trigger with fewer than two other rested Units", () => {
    const attacker = createMockUnit({ ap: 10, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [eb01PrototypeAsshimarTr3Kehaar015], deck: 3, shieldArea: [createMockUnit()] },
      { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [sourceId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(attackerId, sourceId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
