import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01RickDom030 } from "./030-rick-dom.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Rick Dom (GD01-030)", () => {
  it("Breach removes one Shield after Rick Dom destroys an enemy Unit with battle damage", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [gd01RickDom030], shieldArea: [createMockUnit()], deck: 5 },
      { play: [defender], shieldArea: [createMockUnit()], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const rickDomId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(rickDomId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 1);
  });
});
