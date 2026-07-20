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
import { betaGundamHeavyarms034 } from "./034-gundam-heavyarms.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Heavyarms (GD01-034, beta reprint)", () => {
  it("can attack on its deploy turn with Trowa Barton and Breach removes one Shield while paired", () => {
    const trowa = createMockPilot({ name: "Trowa Barton", level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaGundamHeavyarms034, trowa],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], shieldArea: [createMockUnit()], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(betaGundamHeavyarms034));
    expectSuccess(p1.assignPilot(trowa, betaGundamHeavyarms034));
    expectSuccess(p1.enterBattle(betaGundamHeavyarms034, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 1);
  });

  it("does not gain Breach while unpaired", () => {
    const defender = createMockUnit({ ap: 0, hp: 2 });
    const engine = GundamTestEngine.create(
      { play: [betaGundamHeavyarms034], shieldArea: [createMockUnit()], deck: 5 },
      { play: [defender], shieldArea: [createMockUnit()], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(heavyarmsId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore);
  });
});
