import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { deflectingEdge } from "./deflecting-edge.ts";
import { fireball } from "./fireball.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers g7uDOmUf2u-a1 @covers g7uDOmUf2u-a2 */
describe("Deflecting Edge's Sword discount and combat-only three-damage buffer", () => {
  for (const weapon of ["own-sword", "opposing-sword", "own-dagger", "none"] as const)
    for (const expired of [false, true])
      for (const recipient of ["champion", "ally"] as const)
        it(`${weapon}, expired=${expired}, target=${recipient}`, () => {
          const champion = createClassBonusTestChampion(
              deflectingEdge,
              false,
              "activation-discount",
            ),
            opponent = createClassBonusTestChampion(fireball, true, "activation-discount"),
            cost = weapon === "own-sword" ? 0 : 1,
            game = GrandArchiveTestEngine.startFixture({
              firstPlayer: expired ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [
                    giantTortoise,
                    ...(weapon === "own-sword"
                      ? [trainingSword]
                      : weapon === "own-dagger"
                        ? [curvedDagger]
                        : []),
                  ],
                  graveyard: [trainingSword],
                  hand: [deflectingEdge, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: opponent,
                zones: {
                  field: [
                    jewelOfEnlightenment,
                    ...(weapon === "opposing-sword" ? [trainingSword] : []),
                    giantTortoise,
                    woodlandSquirrels,
                    blitzMage,
                  ],
                  hand: [fireball, woodlandSquirrels, woodlandSquirrels],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            ally = p.card(giantTortoise),
            target = recipient === "champion" ? hero : ally,
            other = recipient === "champion" ? ally : hero,
            pay = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (!expired) q.pass();
          const before = game.state;
          expect(() =>
            p.activate(deflectingEdge, {
              reservePayment: pay,
              targets: { "target-1": [q.card(jewelOfEnlightenment).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          if (cost) {
            expect(() =>
              p.activate(deflectingEdge, { targets: { "target-1": [target.objectId] } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(deflectingEdge, {
            reservePayment: pay,
            targets: { "target-1": [target.objectId] },
          });
          expect(p.zone("memory")).toHaveLength(cost);
          passEffectsStack(game);
          if (expired) advanceToMain(game, q.id);
          else {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
          }
          q.activate(fireball, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          q.declareAttack(giantTortoise, other);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[other.objectId]!.damage).toBe(1);
          q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(expired ? 2 : 1);
          q.declareAttack(blitzMage, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(expired ? 5 : 2);
        });
});
