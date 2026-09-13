import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { spiritsBlessing } from "./spirits-blessing.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { cruxSight } from "./crux-sight.ts";

/** @covers P9Y1Q5cQ0F-a2 */
describe("Crux Sight \u2014 P9Y1Q5cQ0F-a2", () => {
  proveDrawCardResolution({ card: cruxSight });
});

/** @covers P9Y1Q5cQ0F-a1 */
describe("Crux Sight's optional additional cost and graveyard return", () => {
  for (const pay of [false, true])
    for (const count of [0, 2])
      it(`pays=${pay}, eligible graveyard cards=${count}`, () => {
        const champion = createClassBonusTestChampion(cruxSight, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [cruxSight, woodlandSquirrels, woodlandSquirrels],
              graveyard: [
                ...Array.from({ length: count }, () => spiritsBlessing),
                woodlandSquirrels,
              ],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { graveyard: [spiritsBlessing] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(cruxSight),
          payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (pay) {
          const before = game.state;
          expect(() =>
            p.activate(source, { payOptionalCost: true, reservePayment: payment.slice(1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, { payOptionalCost: pay, reservePayment: pay ? payment : [] });
        expect(p.zone("memory")).toHaveLength(pay ? 2 : 0);
        passEffectsStack(game);
        if (pay && count) {
          const chosen = p.cards(spiritsBlessing, { zone: "graveyard" })[0]!,
            before = game.state;
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          for (const ref of [
            p.card(woodlandSquirrels, { zone: "graveyard" }),
            q.card(spiritsBlessing),
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [ref.objectId])).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[chosen.objectId]!.zone).toBe("hand");
        }
        expect(game.state.objects[source.objectId]!.zone).toBe(pay ? "banishment" : "graveyard");
        expect(p.zone("hand")).toHaveLength(pay ? (count ? 2 : 1) : 3);
        expect(q.cards(spiritsBlessing, { zone: "graveyard" })).toHaveLength(1);
        expect(p.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      });
});
