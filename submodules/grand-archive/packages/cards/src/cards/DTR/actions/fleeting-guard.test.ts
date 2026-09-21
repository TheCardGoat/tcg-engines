import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { fleetingGuard } from "./fleeting-guard.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 2la6uk1qvl-a1 */
describe("Fleeting Guard — repeated prevention from controlled ephemeral objects", () => {
  for (const count of [0, 1, 2])
    for (const own of [false, true])
      for (const ally of [false, true])
        it(`${count} ephemeral objects protect ${own ? "own" : "opposing"} ${ally ? "ally" : "champion"}`, () => {
          const champion = grantTestChampionLevel(
            enableAllTestElements(
              createClassBonusTestChampion(fleetingGuard, false, "activation-discount"),
            ),
            2,
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, trainingSword],
                graveyard: Array.from({ length: count + 1 }, () => evercurrentRaider),
                hand: [
                  fleetingGuard,
                  ...Array.from({ length: 4 }, () => fireball),
                  ...Array.from({ length: 24 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                graveyard: [evercurrentRaider],
                hand: [woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          q.activate(q.card(evercurrentRaider), {
            activationMethod: "ephemerate",
            reservePayment: q
              .cards(woodlandSquirrels)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          advanceToMain(game, p.id);
          const payment = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const source of p.cards(evercurrentRaider, { zone: "graveyard" }).slice(0, count)) {
            p.activate(source, { activationMethod: "ephemerate", reservePayment: payment(2) });
            passEffectsStack(game);
          }
          const target = owner.card(ally ? giantTortoise : champion);
          for (const invalid of [
            p.card(trainingSword),
            p.card(evercurrentRaider, { zone: "graveyard" }),
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(fleetingGuard, {
                targets: { "target-1": [invalid.objectId] },
                reservePayment: payment(2),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const before = game.state;
          expect(() =>
            p.activate(fleetingGuard, {
              targets: { "target-1": [target.objectId] },
              reservePayment: payment(1),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(fleetingGuard, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment(2),
          });
          passEffectsStack(game);
          const burn = (id: typeof target.objectId) => {
            p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
              targets: { "target-1": [id] },
              reservePayment: payment(4),
            });
            passEffectsStack(game);
          };
          for (let n = 1; n <= 2; n++) {
            burn(target.objectId);
            expect(game.state.objects[target.objectId]!.damage).toBe(n * (2 - count));
          }
          if (!own) {
            p.declareAttack(p.card(giantTortoise), target);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[target.objectId]!.damage).toBe(2 * (2 - count));
          }
          const otherChampion = (own ? q : p).card(champion);
          burn(otherChampion.objectId);
          expect(game.state.objects[otherChampion.objectId]!.damage).toBe(3);
          advanceToMain(game, q.id);
          q.pass();
          burn(target.objectId);
          expect(game.state.objects[target.objectId]!.damage).toBe(ally ? 3 : 2 * (2 - count) + 3);
        });
});
