import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { commandTheHunt } from "./command-the-hunt.ts";
/** @covers rxxwQT054x-a1 @covers rxxwQT054x-a2 */
describe("Command the Hunt discounts before attacks and requires its strengthened allies to attack", () => {
  for (const history of ["none", "ally", "champion", "expired", "diverted"] as const)
    it(`prior attack=${history}`, () => {
      const champion = createClassBonusTestChampion(commandTheHunt, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [woodlandSquirrels, giantTortoise, trainingSword],
            hand: [commandTheHunt, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(champion),
        wood = p.card(woodlandSquirrels, { zone: "field" }),
        giant = p.card(giantTortoise),
        enemy = q.card(giantTortoise);
      if (history === "ally" || history === "expired") {
        p.declareAttack(wood, foe);
        game.resolveCombatWithoutRetaliation();
        if (history === "expired") advanceToMain(game, p.id, game.state.turn.number);
      }
      if (history === "champion") {
        p.declareAttack(hero, foe, { weaponIds: [p.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
      }
      const discount = history === "none" || history === "expired" || history === "diverted",
        pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(commandTheHunt, { reservePayment: pay(discount ? 1 : 2) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(commandTheHunt, { reservePayment: pay(discount ? 2 : 4) });
      passEffectsStack(game);
      p.pass();
      q.pass();
      expect(game.state.turn.phase).toBe("main");
      const initialDamage = game.state.objects[foe.objectId]!.damage;
      p.declareAttack(giant, history === "diverted" ? enemy : foe);
      game.resolveCombatWithoutRetaliation();
      if (history !== "ally") {
        p.pass();
        q.pass();
        expect(game.state.turn.phase).toBe("main");
        p.declareAttack(wood, foe);
        game.resolveCombatWithoutRetaliation();
      }
      if (history === "diverted") {
        p.pass();
        q.pass();
        expect(game.state.turn.phase).toBe("main");
        p.declareAttack(giant, foe);
        expect(game.state.combat).toBeNull();
        expect(game.state.turn.attackAttempts).toContainEqual({
          attackerId: giant.objectId,
          targetIds: [foe.objectId],
          declared: false,
        });
      }
      expect(game.state.objects[foe.objectId]!.damage).toBe(
        initialDamage + (history === "ally" || history === "diverted" ? 3 : 6),
      );
      expect(game.state.objects[wood.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[giant.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id, -1, true);
      expect(game.state.objects[wood.objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[giant.objectId]!.states.has("rested")).toBe(false);
      q.declareAttack(enemy, hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      p.declareAttack(giant, foe);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(
        initialDamage + (history === "ally" || history === "diverted" ? 4 : 7),
      );
    });
});
