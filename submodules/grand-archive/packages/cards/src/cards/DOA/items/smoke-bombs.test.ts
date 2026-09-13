import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { smokeBombs } from "./smoke-bombs.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers ScGcOmkoQt-a1 */
describe("Smoke Bombs' temporary targeted stealth", () => {
  for (const own of [false, true])
    it(`can protect ${own ? "own" : "opposing"} ally and draws only for its controller`, () => {
      const champion = createClassBonusTestChampion(smokeBombs, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: own ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            field: [smokeBombs, giantTortoise, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        defender = own ? p : q,
        attacker = own ? q : p,
        target = defender.card(giantTortoise),
        bomb = p.card(smokeBombs);
      if (own) q.pass();
      for (const illegal of [p.card(champion), q.card(champion), bomb]) {
        const before = game.state;
        expect(() =>
          p.activateAbility(bomb, "ScGcOmkoQt-a1", { targets: { "target-1": [illegal.objectId] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activateAbility(bomb, "ScGcOmkoQt-a1", { targets: { "target-1": [target.objectId] } });
      expect(game.state.objects[bomb.objectId]!.zone).toBe("banishment");
      expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(0);
      passEffectsStack(game);
      expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(1);
      expect(q.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(0);
      const before = game.state;
      expect(() =>
        attacker.declareAttack(attacker.card(woodlandSquirrels, { zone: "field" }), target),
      ).toThrow();
      expect(game.state).toEqual(before);
      attacker.declareAttack(
        attacker.card(woodlandSquirrels, { zone: "field" }),
        defender.card(woodlandSquirrels, { zone: "field" }),
      );
      game.resolveCombatWithoutRetaliation();
      expect(defender.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      advanceToMain(game, defender.id);
      advanceToMain(game, attacker.id);
      attacker.declareAttack(attacker.card(woodlandSquirrels, { zone: "field" }), target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(1);
    });
});
