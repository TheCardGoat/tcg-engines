import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { eminentCommander } from "./eminent-commander.ts";
import { rivetingWinds } from "../../PRD/actions/riveting-winds.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blazingDirewolf } from "../../DOA/allies/blazing-direwolf.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers iow4occyxi-a1 */
describe("Eminent Commander — champion combat damage this turn", () => {
  for (const matching of [false, true])
    for (const entry of [
      { power: 1, hits: 0, ally: false },
      { power: 1, hits: 1, ally: false },
      { power: 2, hits: 1, ally: false },
      { power: 3, hits: 1, ally: false },
      { power: 4, hits: 1, ally: false },
      { power: 1, hits: 2, ally: false },
      { power: 2, hits: 2, ally: false },
      { power: 1, hits: 3, ally: false },
      { power: 4, hits: 1, ally: true },
    ])
      for (const expired of [false, true]) {
        it(`class=${matching}, damage=${entry.power} x ${entry.hits}, ally=${entry.ally}, expired=${expired}`, () => {
          const base = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(eminentCommander, matching, "activation-discount"),
              entry.ally ? 5 : 0,
            ),
          );
          const champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: {
                ...requireSingleFace(base),
                stats: { level: 0, life: 100, power: entry.power },
              },
            },
          };
          const wakes = Math.max(0, entry.hits - 1),
            wakeCost = matching ? 2 : 4;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [blazingDirewolf],
                hand: [
                  eminentCommander,
                  ...Array.from({ length: wakes }, () => rivetingWinds),
                  ...Array.from({ length: 5 + wakes * wakeCost }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (let n = 0; n < entry.hits; n++) {
            p.declareAttack(entry.ally ? p.card(blazingDirewolf) : hero, foe);
            game.resolveCombatWithoutRetaliation();
            if (n < entry.hits - 1) {
              p.activate(p.cards(rivetingWinds, { zone: "hand" })[0]!, {
                reservePayment: pay(wakeCost),
              });
              passEffectsStack(game);
            }
          }
          if (expired) advanceToMain(game, p.id, game.state.turn.number);
          const discounted = matching && !expired && !entry.ally && entry.power * entry.hits >= 3,
            cost = discounted ? 2 : 5;
          const before = game.state;
          expect(() => p.activate(eminentCommander, { reservePayment: pay(cost - 1) })).toThrow();
          expect(game.state).toEqual(before);
          const hand = p.zone("hand").length;
          p.activate(eminentCommander, { reservePayment: pay(cost) });
          expect(p.zone("hand")).toHaveLength(hand - cost - 1);
          passEffectsStack(game);
          expect(p.cards(eminentCommander, { zone: "field" })).toHaveLength(1);
        });
      }
});
