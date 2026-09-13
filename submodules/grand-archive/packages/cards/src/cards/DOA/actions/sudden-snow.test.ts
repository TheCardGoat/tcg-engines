import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { suddenSnow } from "./sudden-snow.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
/** @covers dxAEI20h8F-a1 */
describe("sudden-snow optionally banishes own Floating Memory for its reward", () => {
  for (const available of [false, true])
    for (const accept of [false, true])
      it(`available=${available}, accept=${accept}`, () => {
        const champion = createClassBonusTestChampion(suddenSnow, false, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  suddenSnow,
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
          source = p.card(suddenSnow, { zone: "hand" }),
          top = p.zone("main-deck")[0]!;
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
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
      });
});

/** @covers dxAEI20h8F-a2 */
describe("Sudden Snow changes both players' later ally entries for this turn", () => {
  for (const own of [false, true])
    it(`new ally controlled by caster=${own}`, () => {
      const champion = createClassBonusTestChampion(suddenSnow, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [suddenSnow, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [woodlandSquirrels, woodlandSquirrels],
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        owner = own ? p : q,
        other = own ? q : p,
        old = p.card(woodlandSquirrels, { zone: "field" }),
        otherOld = q.card(woodlandSquirrels, { zone: "field" });
      if (!own) q.pass();
      p.activate(suddenSnow, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      const priority = game.waitState();
      if (priority.kind === "opportunity" && priority.playerId !== owner.id)
        game.player(priority.playerId).pass();
      const first = owner.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      owner.activate(first);
      passEffectsStack(game);
      expect(game.state.objects[first.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[old.objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[otherOld.objectId]!.states.has("rested")).toBe(false);
      expect(() => owner.declareAttack(first, other.card(champion))).toThrow();
      advanceToMain(game, other.id);
      const next = other.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      other.activate(next);
      passEffectsStack(game);
      expect(game.state.objects[next.objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[first.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, owner.id);
      expect(game.state.objects[first.objectId]!.states.has("rested")).toBe(false);
    });
});
