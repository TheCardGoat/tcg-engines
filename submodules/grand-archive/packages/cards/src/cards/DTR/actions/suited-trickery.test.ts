import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { suitedTrickery } from "./suited-trickery.ts";
import { fiveOfSpades } from "../allies/five-of-spades.ts";
import { wonderlandsReign } from "../phantasias/wonderlands-reign.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers uxhmucm8si-a1 */
describe("Suited Trickery — symmetric per-attack champion tax and conditional memory draw", () => {
  for (const suited of ["none", "own-ally", "own-phantasia", "opposing-ally"] as const)
    it(`draws for ${suited} and taxes each champion declaration until its controller's next turn`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(suitedTrickery, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [
              trainingSword,
              trainingSword,
              trainingSword,
              giantTortoise,
              ...(suited === "own-ally"
                ? [fiveOfSpades]
                : suited === "own-phantasia"
                  ? [wonderlandsReign]
                  : []),
            ],
            hand: [
              suitedTrickery,
              spiritsBlessing,
              fiveOfSpades,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [
              trainingSword,
              giantTortoise,
              ...(suited === "opposing-ally" ? [fiveOfSpades] : []),
            ],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        opponent = q.card(champion);
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const top = p.zone("main-deck")[0]!;
      p.activate(suitedTrickery, { reservePayment: payment(1) });
      expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
      passEffectsStack(game);
      expect(game.state.objects[top.objectId]!.zone).toBe(
        suited === "own-ally" ? "memory" : "main-deck",
      );
      const swords = p.cards(trainingSword);
      for (let n = 0; n < 2; n++) {
        const before = game.state;
        for (const amount of [0, 1]) {
          expect(() =>
            p.declareAttack(hero, opponent, {
              weaponIds: [swords[0]!.objectId],
              reservePayment: payment(amount),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.declareAttack(hero, opponent, {
          weaponIds: [swords[0]!.objectId],
          reservePayment: payment(2),
        });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[opponent.objectId]!.damage).toBe(n + 1);
        if (n === 0) {
          p.activate(spiritsBlessing, {
            reservePayment: payment(1),
            costSelections: [[swords[1]!.objectId]],
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
        }
      }
      p.declareAttack(p.card(giantTortoise), opponent);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponent.objectId]!.damage).toBe(3);
      advanceToMain(game, q.id);
      const before = game.state;
      expect(() =>
        q.declareAttack(opponent, hero, { weaponIds: [q.card(trainingSword).objectId] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      q.declareAttack(opponent, hero, {
        weaponIds: [q.card(trainingSword).objectId],
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      game.resolveCombatWithoutRetaliation();
      q.declareAttack(q.card(giantTortoise), hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(2);
      advanceToMain(game, p.id);
      p.declareAttack(hero, opponent, { weaponIds: [swords[2]!.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponent.objectId]!.damage).toBe(4);
    });
});
