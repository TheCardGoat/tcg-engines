import { describe, expect, it } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { vertusGaiasRoar } from "./vertus-gaias-roar.ts";

/** @covers dZ960Hnkzv-a1 */
describe("Vertus, Gaia's Roar \u2014 dZ960Hnkzv-a1", () => {
  provePrideAlly({ card: vertusGaiasRoar, pride: 10, power: 8 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { grayWolf } from "./gray-wolf.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { eagerPage } from "./eager-page.ts";
import { acceptedContract } from "../actions/accepted-contract.ts";
/** @covers dZ960Hnkzv-a2 */
describe("Vertus counts own Animal and Beast allies in the graveyard for its entry power", () => {
  for (const classBonus of [false, true])
    for (const count of [0, 2])
      it(`class=${classBonus}, grave allies=${count}`, () => {
        const base = grantTestChampionLevel(
            createClassBonusTestChampion(vertusGaiasRoar, classBonus, "activation-discount"),
            10,
          ),
          champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), elements: ["TERA" as const, "WATER" as const] },
            },
          },
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  vertusGaiasRoar,
                  giantTortoise,
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                field: [woodlandSquirrels, eagerPage],
                graveyard: [
                  eagerPage,
                  acceptedContract,
                  ...(count ? [woodlandSquirrels, grayWolf] : []),
                ],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                graveyard: [woodlandSquirrels, grayWolf],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(vertusGaiasRoar, { zone: "hand" }),
          ally = p.card(woodlandSquirrels, { zone: "field" }),
          power = (id: typeof ally.objectId) => {
            const object = game.state.objects[id];
            if (!object) throw new Error("Missing unit");
            return deriveGrandArchiveNumericProperty(object, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          };
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(power(ally.objectId)).toBe(1 + (classBonus ? count : 0));
        expect(power(source.objectId)).toBe(8 + (classBonus ? count : 0));
        expect(power(q.card(giantTortoise).objectId)).toBe(1);
        expect(power(p.card(eagerPage, { zone: "field" }).objectId)).toBe(
          1 + (classBonus ? count : 0),
        );
        p.activate(giantTortoise, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(power(p.card(giantTortoise, { zone: "field" }).objectId)).toBe(1);
        p.declareAttack(ally, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          1 + (classBonus ? count : 0),
        );
        advanceToMain(game, q.id);
        expect(power(ally.objectId)).toBe(1);
        expect(power(source.objectId)).toBe(8);
      });
});
