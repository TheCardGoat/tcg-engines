import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { callThePack } from "./call-the-pack.ts";

/** @covers mdiK8UC78c-a1 */
describe("Call the Pack \u2014 mdiK8UC78c-a1", () => {
  proveClassBonusActivationDiscount({ card: callThePack, discount: 2 });
});

/** @covers mdiK8UC78c-a2 */
describe("Call the Pack counts only its controlled Animals and permits each Beast separately", () => {
  for (const animals of [0, 2])
    for (const choices of [0, 1, 2])
      it(`Animals=${animals}, accepted=${choices}`, () => {
        const champion = createClassBonusTestChampion(callThePack, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [...Array.from({ length: animals }, () => woodlandSquirrels), grayWolf],
              hand: [
                callThePack,
                grayWolf,
                grayWolf,
                grayWolf,
                eagerPage,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], hand: [grayWolf] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          beasts = p.cards(grayWolf, { zone: "hand" });
        p.activate(callThePack, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        for (let i = 0; i < animals; i++) {
          answerDecision(game, "resolve-optional-effect", i < choices);
          passEffectsStack(game);
          if (i < choices) {
            for (const bad of [
              q.card(grayWolf),
              p.card(eagerPage),
              p.cards(woodlandSquirrels, { zone: "hand" })[0]!,
            ])
              expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
            answerDecision(game, "resolve-effect-choice", [beasts[i]!.objectId]);
            passEffectsStack(game);
          }
        }
        expect(game.state.decision).toBeNull();
        expect(p.cards(grayWolf, { zone: "field" })).toHaveLength(1 + Math.min(animals, choices));
        expect(p.cards(grayWolf, { zone: "hand" })).toHaveLength(3 - Math.min(animals, choices));
        expect(q.card(grayWolf, { zone: "hand" })).toBeDefined();
        expect(p.card(callThePack, { zone: "graveyard" })).toBeDefined();
      });
});
