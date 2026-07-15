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
import { gd01NoinSAries007 } from "./007-noin-s-aries.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function destroyNoinWithPublicMoves(hasOtherOz: boolean): {
  engine: GundamTestEngine;
  noinId: string;
} {
  const ally = createMockUnit({ traits: [hasOtherOz ? "oz" : "earth federation"] });
  const attacker = createMockUnit({ ap: 3, hp: 10 });
  const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
  const engine = GundamTestEngine.create(
    { play: [gd01NoinSAries007, ally], shieldArea: [createMockUnit()], deck: 5 },
    { play: [attacker, transitionDefender], deck: 5 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const noinId = p1.getCardsInZone("battleArea")[0]!;
  const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");

  restUnitsByAttackingDirectly(engine, PLAYER_TWO, [transitionDefenderId!]);
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.enterBattle(noinId, transitionDefenderId!));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.enterBattle(attackerId!, noinId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());

  return { engine, noinId };
}

describe("Noin's Aries (GD01-007)", () => {
  it("can attack on its deploy turn after pairing Lucrezia Noin", () => {
    const noin = createMockPilot({ name: "Lucrezia Noin", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01NoinSAries007, noin],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01NoinSAries007));
    expectSuccess(p1.assignPilot(noin, gd01NoinSAries007));
    expectSuccess(p1.enterBattle(gd01NoinSAries007, enemyId));
  });

  it("draws 1 after it is destroyed while another friendly OZ Unit is in play", () => {
    const { engine, noinId } = destroyNoinWithPublicMoves(true);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardZone(noinId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({ handCount: 2, deckCount: 3 });
  });

  it("does not draw when the other friendly Unit is not an OZ Unit", () => {
    const { engine, noinId } = destroyNoinWithPublicMoves(false);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardZone(noinId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({ handCount: 1, deckCount: 4 });
  });
});
