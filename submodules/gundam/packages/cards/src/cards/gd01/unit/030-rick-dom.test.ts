import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPlayer,
  expectPublicLog,
  resolveBattle,
} from "@tcg/gundam-engine";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd01RickDom030 } from "./030-rick-dom.ts";

describe("Rick Dom (GD01-030)", () => {
  describe("<Breach 2> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)", () => {
    it("deals exactly 2 Breach damage after destroying a Unit in battle", () => {
      expectBreachAbility(gd01RickDom030, 2);
    });

    it("removes one Shield after Rick Dom destroys an enemy Unit with battle damage", () => {
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [gd01RickDom030], shieldArea: [createMockUnit()], deck: 5 },
        { play: [defender], shieldArea: [createMockUnit()], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [p2.unit(defender).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      p1.must.attack(gd01RickDom030).into(defender);
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();

      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p2, defender).toBeIn("trash");
      expectPlayer(p2).toHaveShieldCount(shieldsBefore - 1);
    });

    it("does not deal Breach damage when the attack fails to destroy the defender", () => {
      const defender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [gd01RickDom030], deck: 5 },
        {
          play: [{ card: defender, exhausted: true }],
          shieldArea: [createMockUnit()],
          deck: 5,
        },
      );
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

      resolveBattle(engine, gd01RickDom030, defender);

      expectCard(p2, defender).toBeIn("battleArea");
      expectPlayer(p2).toHaveShieldCount(shieldsBefore);
    });

    it("shows the Breach keyword on the deployed Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01RickDom030],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.deployUnit(gd01RickDom030);

      expectCard(p1, gd01RickDom030).toShowKeyword("Breach");
    });

    it("stays in hand below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01RickDom030],
        resourceArea: activeResources(2),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd01RickDom030), "INSUFFICIENT_RESOURCE_LEVEL");
      expectPlayer(p1).toHaveHandCount(1);
    });
  });
});
