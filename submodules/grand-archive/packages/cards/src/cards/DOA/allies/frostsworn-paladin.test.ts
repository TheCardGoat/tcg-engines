import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { frostswornPaladin } from "./frostsworn-paladin.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
/** @covers rpOaAjgtue-a2 */
describe("frostsworn-paladin optionally banishes own Floating Memory for its reward", () => {
  for (const available of [false, true])
    for (const accept of [false, true])
      it(`available=${available}, accept=${accept}`, () => {
        const champion = createClassBonusTestChampion(
            frostswornPaladin,
            false,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  frostswornPaladin,
                  favorableWinds,
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                ],
                graveyard: [
                  woodlandSquirrels,
                  ...(available ? [favorableWinds, favorableWinds] : []),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: [favorableWinds], "main-deck": [woodlandSquirrels] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(frostswornPaladin, { zone: "hand" }),
          top = p.zone("main-deck")[0]!;
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        const hand = p.zone("hand").length;
        passEffectsStack(game);
        if (available) {
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) {
            const before = game.state;
            for (const bad of [
              p.card(woodlandSquirrels, { zone: "graveyard" }),
              q.card(favorableWinds, { zone: "graveyard" }),
              p.card(favorableWinds, { zone: "hand" }),
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [
              p.cards(favorableWinds, { zone: "graveyard" })[0]!.objectId,
            ]);
          }
        }
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(hand + (available && accept ? 1 : 0));
        expect(game.state.objects[top.objectId]!.zone).toBe(
          available && accept ? "hand" : "main-deck",
        );
        expect(p.cards(favorableWinds, { zone: "banishment" })).toHaveLength(
          available && accept ? 1 : 0,
        );
        expect(q.card(favorableWinds, { zone: "graveyard" })).toBeDefined();
        expect(p.card(favorableWinds, { zone: "hand" })).toBeDefined();
        expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(
          available && accept ? 1 : 0,
        );
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(power()).toBe(available && accept ? 3 : 2);
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          available && accept ? 3 : 2,
        );
        advanceToMain(game, q.id);
        expect(power()).toBe(available && accept ? 3 : 2);
      });
});
