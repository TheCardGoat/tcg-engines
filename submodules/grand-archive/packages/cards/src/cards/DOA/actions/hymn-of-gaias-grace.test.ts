import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";

import { hymnOfGaiasGrace } from "./hymn-of-gaias-grace.ts";

/** @covers okDVkV1l76-a1 */
describe("Hymn of Gaia's Grace \u2014 resolution", () => {
  proveGlimpsePlay({
    card: hymnOfGaiasGrace,
    cost: { kind: "reserve", amount: 3 },
    count: 3,
    draw: "hand",
  });
});

/** @covers okDVkV1l76-a2 */
describe("Hymn summons a qualifying ally and optionally redirects only an attack on its champion", () => {
  for (const target of ["champion", "ally", "none"] as const)
    for (const summon of [false, true])
      for (const redirect of [false, true])
        for (const beast of [false, true])
          it(`target=${target}, summon=${summon}, redirect=${redirect}, Beast=${beast}`, () => {
            const champion = grantTestChampionLevel(
              createClassBonusTestChampion(hymnOfGaiasGrace, true, "activation-discount"),
              2,
            );
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  "main-deck": [eagerPage, eagerPage, eagerPage],
                  field: [giantTortoise],
                  hand: [
                    hymnOfGaiasGrace,
                    grayWolf,
                    giantTortoise,
                    eagerPage,
                    ...Array.from({ length: 4 }, () => woodlandSquirrels),
                  ],
                },
              },
              playerTwo: { champion, zones: { field: [giantTortoise], hand: [grayWolf] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              hero = p.card(champion),
              other = p.card(giantTortoise, { zone: "field" }),
              attacker = q.card(giantTortoise),
              rescuer = beast ? p.card(grayWolf) : p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
            if (target !== "none") q.declareAttack(attacker, target === "champion" ? hero : other);
            q.pass();
            p.activate(hymnOfGaiasGrace, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(1, 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            });
            passEffectsStack(game);
            const glimpse = game.state.decision;
            if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: glimpse.cardIds,
              bottom: [],
            });
            passEffectsStack(game);
            answerDecision(game, "resolve-optional-effect", summon);
            passEffectsStack(game);
            if (summon) {
              for (const bad of [
                q.card(grayWolf),
                p.cards(eagerPage, { zone: "hand" })[0]!,
                p.card(giantTortoise, { zone: "hand" }),
              ])
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
              answerDecision(game, "resolve-effect-choice", [rescuer.objectId]);
              passEffectsStack(game);
              expect(game.state.objects[rescuer.objectId]!.zone).toBe("field");
              if (target === "champion") {
                answerDecision(game, "resolve-optional-effect", redirect);
                passEffectsStack(game);
              } else expect(game.state.decision).toBeNull();
            }
            const redirected = summon && redirect && target === "champion";
            if (target !== "none") {
              expect(game.state.combat?.targetIds).toEqual([
                redirected
                  ? rescuer.objectId
                  : target === "champion"
                    ? hero.objectId
                    : other.objectId,
              ]);
              game.resolveCombatWithoutRetaliation();
            }
            expect(game.state.objects[hero.objectId]!.damage).toBe(
              target === "champion" && !redirected ? 1 : 0,
            );
            expect(game.state.objects[rescuer.objectId]!.zone).toBe(
              !summon ? "hand" : redirected && !beast ? "graveyard" : "field",
            );
          });
});
