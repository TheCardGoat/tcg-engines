import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { fourOfHearts } from "./four-of-hearts.ts";
import { twoOfHearts } from "./two-of-hearts.ts";
import { threeOfSpades } from "./three-of-spades.ts";
import { fourOfSpades } from "./four-of-spades.ts";
import { fiveOfSpades } from "./five-of-spades.ts";
import { suitedTrickery } from "../actions/suited-trickery.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers xgax8bbjqj-a1 */
describe("Four of Hearts — draw then put a Suited ally into play", () => {
  for (const distinct of [false, true])
    for (const origin of ["drawn", "memory", "payment", "none"] as const) {
      if (distinct && origin === "payment") continue;
      it(`uses ${origin} after the draw, with exact discounted payment, distinct=${distinct}`, () => {
        const champion = createClassBonusTestChampion(fourOfHearts, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                fourOfHearts,
                fourOfHearts,
                ...(distinct ? [twoOfHearts, threeOfSpades, fiveOfSpades] : []),
              ],
              hand: [twoOfHearts, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              memory: [
                fourOfSpades,
                woodlandSquirrels,
                suitedTrickery,
                ...(origin === "memory" ? [twoOfHearts] : []),
              ],
              "main-deck": Array.from({ length: 2 }, () =>
                origin === "drawn" ? threeOfSpades : woodlandSquirrels,
              ),
            },
          },
          playerTwo: { champion, zones: { memory: [threeOfSpades] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.cards(fourOfHearts)[0]!;
        const top = p.zone("main-deck")[0]!;
        const fromHand = p.card(twoOfHearts, { zone: "hand" });
        const payment = distinct
          ? []
          : (origin === "payment"
              ? [fromHand, ...p.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 2)]
              : p.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 3)
            ).map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        if (!distinct) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, "xgax8bbjqj-a1", { reservePayment: payment.slice(1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "xgax8bbjqj-a1", { reservePayment: payment });
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.objects[top.objectId]!.zone).toBe("memory");
        expect(p.zone("main-deck")).toHaveLength(1);
        if (origin !== "none") {
          for (const invalid of [
            q.card(threeOfSpades),
            p.card(fourOfSpades),
            p.card(suitedTrickery),
            p.cards(woodlandSquirrels, { zone: "memory" })[0]!,
            source,
            ...(origin !== "payment" ? [fromHand] : []),
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const selected =
            origin === "drawn"
              ? top
              : origin === "payment"
                ? fromHand
                : p.card(twoOfHearts, { zone: "memory" });
          const incarnation = game.state.objects[selected.objectId]!.incarnation;
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe("field");
          expect(game.state.objects[selected.objectId]!.controllerId).toBe(p.id);
          expect(game.state.objects[selected.objectId]!.incarnation).toBeGreaterThan(incarnation);
          expect(game.state.objects[selected.objectId]!.states.has("rested")).toBe(false);
          p.declareAttack(selected, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
            origin === "drawn" ? 2 : 1,
          );
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        expect(q.zone("memory")).toHaveLength(1);
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "xgax8bbjqj-a1", {
            reservePayment: distinct
              ? []
              : p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, origin === "none" ? 3 : 2)
                  .map((card) => ({ kind: "card", cardId: card.objectId })),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      });
    }
});
