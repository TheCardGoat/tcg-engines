import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveDrawAndPrepare(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  cost: number,
  counters: number,
  payment: "none" | "regalia" | "ally",
) {
  for (const matching of [false, true])
    it(`draws then adds preparation with class ${matching} and ${payment} payment`, () => {
      const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        ),
        opponent = lineageTestChampion("Other", 0);
      const paymentCard = payment === "regalia" ? trainingSword : giantTortoise;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, card, ...Array.from({ length: cost * 2 + 1 }, () => woodlandSquirrels)],
            field:
              payment === "none"
                ? []
                : [paymentCard, paymentCard, payment === "regalia" ? giantTortoise : trainingSword],
            "main-deck": [woodlandSquirrels, giantTortoise, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: { field: [trainingSword, giantTortoise], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(opponent);
      const pay = () =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const opponentDeck = q.zone("main-deck");
      for (let cast = 1; cast <= 2; cast++) {
        const source = p.cards(card, { zone: "hand" })[0]!,
          paid = payment === "none" ? undefined : p.cards(paymentCard, { zone: "field" })[0]!;
        const before = game.state;
        if (paid) {
          expect(() =>
            p.activate(source, { reservePayment: pay(), costSelections: [[]] }),
          ).toThrow();
          expect(game.state).toEqual(before);
          expect(() =>
            p.activate(source, {
              reservePayment: pay(),
              costSelections: [
                [p.card(payment === "regalia" ? giantTortoise : trainingSword).objectId],
              ],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          expect(() =>
            p.activate(source, {
              reservePayment: pay(),
              costSelections: [[q.card(paymentCard).objectId]],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const deck = p.zone("main-deck"),
          hand = p.zone("hand").length;
        p.activate(source, {
          reservePayment: pay(),
          ...(paid ? { costSelections: [[paid.objectId]] } : {}),
        });
        if (paid)
          expect(game.state.objects[paid.objectId]!.zone).toBe(
            payment === "regalia" ? "material-deck" : "graveyard",
          );
        expect(p.zone("main-deck")).toEqual(deck);
        expect(p.zone("hand")).toHaveLength(hand - cost - 1);
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
          (cast - 1) * counters,
        );
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(hand - cost);
        expect(p.zone("hand")).toContainEqual(deck[0]);
        expect(p.zone("main-deck")).toEqual(deck.slice(1));
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(cast * counters);
        expect(game.state.objects[foe.objectId]!.counters.preparation ?? 0).toBe(0);
        expect(q.zone("main-deck")).toEqual(opponentDeck);
      }
    });
}
