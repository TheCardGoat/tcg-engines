import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
import { describe } from "vitest";
import { adventOfTheStormcaller } from "./advent-of-the-stormcaller.ts";

/** @covers ZSSegCjquB-a1 */
describe("Advent of the Stormcaller \u2014 resolution", () => {
  proveClassBonusEfficiency({ card: adventOfTheStormcaller, printedCost: 15, attack: false });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { fireball } from "./fireball.ts";
import { arcaneSight } from "./arcane-sight.ts";
import { powerOverwhelming } from "./power-overwhelming.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers ZSSegCjquB-a2 */
for (const level of [0, 2, 6])
  for (const take of [0, 1, 2])
    for (const placement of ["top", "bottom", "split"] as const)
      it(`Advent reveals LV, banishes only selected arcane and orders remainder: LV=${level},take=${take},placement=${placement}`, () => {
        const champion = grantTestChampionLevel(
            createClassBonusTestChampion(adventOfTheStormcaller, true, "activation-discount"),
            level,
          ),
          cost = 15 - level;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                adventOfTheStormcaller,
                ...Array.from({ length: cost }, () => woodlandSquirrels),
              ],
              "main-deck": [
                arcaneSight,
                woodlandSquirrels,
                powerOverwhelming,
                giantTortoise,
                fireball,
                woodlandSquirrels,
              ],
              field: [giantTortoise],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise, trainingSword], "main-deck": [arcaneSight] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck").map((c) => c.objectId),
          revealed = deck.slice(0, level),
          arcane = p
            .zone("main-deck")
            .filter(
              (c) =>
                [arcaneSight.canonicalId, powerOverwhelming.canonicalId].includes(c.definitionId) &&
                revealed.includes(c.objectId),
            )
            .map((c) => c.objectId),
          paid = arcane.slice(0, take),
          foe = q.card(champion),
          ally = p.card(giantTortoise);
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(adventOfTheStormcaller, { reservePayment: payment.slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(adventOfTheStormcaller, { reservePayment: payment });
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-choice") {
          for (const invalid of [
            [q.card(arcaneSight, { zone: "main-deck" }).objectId],
            ...(deck.length > level ? [[deck[level]!]] : []),
            ...revealed
              .filter((id) => !arcane.includes(id))
              .slice(0, 1)
              .map((id) => [id]),
          ]) {
            const state = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(state);
          }
          answerDecision(game, "resolve-effect-choice", paid);
          passEffectsStack(game);
        }
        for (let i = 0; i < paid.length; i++) {
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(trainingSword).objectId]),
          ).toThrow();
          answerDecision(game, "resolve-effect-choice", [(i % 2 ? ally : foe).objectId]);
          passEffectsStack(game);
        }
        const remaining = revealed.filter((id) => !paid.includes(id)).reverse(),
          top =
            placement === "top" ? remaining : placement === "split" ? remaining.slice(0, 1) : [],
          bottom =
            placement === "top" ? [] : placement === "split" ? remaining.slice(1) : remaining;
        if (remaining.length) {
          const state = game.state;
          expect(() =>
            answerDecision(game, "resolve-move-partition", {
              partitions: [remaining.slice(1), []],
            }),
          ).toThrow();
          expect(game.state).toEqual(state);
          answerDecision(game, "resolve-move-partition", { partitions: [top, bottom] });
          passEffectsStack(game);
        }
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
          ...top,
          ...deck.slice(level),
          ...bottom,
        ]);
        expect(
          p
            .zone("banishment")
            .map((c) => c.objectId)
            .sort(),
        ).toEqual([...paid].sort());
        expect(game.state.objects[foe.objectId]!.damage).toBe(paid.length ? 2 : 0);
        expect(game.state.objects[ally.objectId]!.damage).toBe(paid.length > 1 ? 2 : 0);
        expect(p.zone("memory")).toHaveLength(cost);
        expect(q.zone("main-deck")).toHaveLength(1);
      });
