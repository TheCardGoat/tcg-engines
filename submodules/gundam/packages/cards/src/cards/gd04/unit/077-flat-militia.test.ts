import { describe, expect, it } from "vite-plus/test";
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
} from "@tcg/gundam-engine";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd04FlatMilitia077 } from "./077-flat-militia.ts";

describe("Flat (Militia) (GD04-077)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("redirects an attack and rests itself when declared as a Blocker", () => {
      expectBlockerAbility(gd04FlatMilitia077);
    });

    it("takes the attack damage instead of the original defender", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, gd04FlatMilitia077] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(attacker).into(defender);
      p2.must.declareBlock(gd04FlatMilitia077);
      expectPublicLog(engine, "gundam.move.blockDeclared", {
        blockerPlayerId: PLAYER_TWO,
      });
      p2.must.passBattleAction();
      p1.must.passBattleAction();

      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p2, gd04FlatMilitia077).toBeIn("battleArea").toHaveDamage(3);
      expectCard(p2, defender).toHaveDamage(0);
      expectCard(p1, attacker).toHaveDamage(2);
    });

    it("cannot block while rested", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: defender, exhausted: true },
            { card: gd04FlatMilitia077, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(attacker).into(defender);
      expectFailure(p2.declareBlock(gd04FlatMilitia077), "CANNOT_BLOCK");
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        target: p2.unit(defender).instanceId,
      });
    });

    it("shows the Blocker keyword after deploy", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04FlatMilitia077],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.deployUnit(gd04FlatMilitia077);

      expectCard(p1, gd04FlatMilitia077).toHaveAp(2).toHaveHp(4).toShowKeyword("Blocker");
    });

    it("stays in hand below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04FlatMilitia077],
        resourceArea: activeResources(2),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd04FlatMilitia077), "INSUFFICIENT_RESOURCE_LEVEL");
      expectPlayer(p1).toHaveHandCount(1);
    });
  });
});
