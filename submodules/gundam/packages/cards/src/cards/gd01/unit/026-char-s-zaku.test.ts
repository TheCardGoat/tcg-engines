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
import { gd01CharSZaku026 } from "./026-char-s-zaku.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function destroyPairedCharZaku(): {
  engine: GundamTestEngine;
  sourceId: string;
  pilotId: string;
} {
  const char = createMockPilot({ name: "Char Aznable", level: 1, cost: 1 });
  const attacker = createMockUnit({ ap: 4, hp: 10 });
  const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd01CharSZaku026, char],
      resourceArea: activeResources(3),
      shieldArea: [createMockUnit()],
      deck: 5,
    },
    { play: [attacker, transitionDefender], deck: 5 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const pilotId = p1.getHand()[1]!;
  const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");

  restUnitsByAttackingDirectly(engine, PLAYER_TWO, [transitionDefenderId!]);
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.deployUnit(gd01CharSZaku026));
  const sourceId = p1.getCardsInZone("battleArea")[0]!;
  expectSuccess(p1.assignPilot(char, sourceId));
  expectSuccess(p1.enterBattle(sourceId, transitionDefenderId!));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.enterBattle(attackerId!, sourceId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());

  return { engine, sourceId, pilotId };
}

describe("Char's Zaku II (GD01-026)", () => {
  it("deploys a rested AP3 HP1 Unit token after being destroyed while paired", () => {
    const { engine, sourceId, pilotId } = destroyPairedCharZaku();
    const p1 = engine.asPlayer(PLAYER_ONE);
    const tokenId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getCardZone(sourceId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(tokenId)).toMatchObject({
      effectiveAp: 3,
      effectiveHp: 1,
      exhausted: true,
    });
  });

  it("does not deploy a token when destroyed without a paired Pilot", () => {
    const attacker = createMockUnit({ ap: 4, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd01CharSZaku026], deck: 5 },
      { play: [attacker], shieldArea: [createMockUnit()], deck: 5 },
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

    expect(p1.getCardZone(sourceId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });
});
