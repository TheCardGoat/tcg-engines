import { describe } from "vitest";
import { businessCard } from "./business-card.ts";

import { proveAsEntersChoice } from "../../../testing/as-enters-choice.ts";
/** @covers lumV6cG9oc-a1 */
describe("businessCard — entry choice", () => {
  proveAsEntersChoice(businessCard, "ally");
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { signaltechOne } from "./signaltech-one.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers lumV6cG9oc-a2 */
describe("Business Card — chosen ally Scavenge and Phone limit", () => {
  for (const phone of [false, true])
    for (const position of [1, 8, 9, 20, 21, 0]) {
      it(`scavenges the first named ally: own Phone=${phone}, position=${position}`, () => {
        const champion = createClassBonusTestChampion(businessCard, false, "activation-discount");
        const cards = Array.from({ length: 25 }, (_, i) =>
          i % 2 ? giantTortoise : glacialGuidance,
        );
        if (position) cards.splice(position - 1, 0, woodlandSquirrels, woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            preserveMainDeckOrder: true,
            champion,
            zones: {
              hand: [
                businessCard,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              field: phone ? [signaltechOne] : [],
              "main-deck": cards,
            },
          },
          playerTwo: {
            champion,
            zones: { field: [signaltechOne], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(businessCard);
        const payment = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(source, { reservePayment: payment() });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", "Woodland Squirrels");
        passEffectsStack(game);
        const deck = p.zone("main-deck"),
          otherDeck = q.zone("main-deck"),
          hand = p.zone("hand");
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "lumV6cG9oc-a2", { reservePayment: payment().slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "lumV6cG9oc-a2", { reservePayment: payment() });
        expect(p.zone("graveyard")).toContainEqual(source);
        expect(p.zone("memory")).toHaveLength(4);
        expect(p.zone("main-deck")).toEqual(deck);
        const paid = game.state;
        expect(() => p.activateAbility(source, "lumV6cG9oc-a2", { reservePayment: [] })).toThrow();
        expect(game.state).toEqual(paid);
        const history = game.state.eventHistory.length;
        passEffectsStack(game);
        const limit = phone ? 20 : 8,
          found = position > 0 && position <= limit,
          revealed = found ? position : limit;
        const events = game.state.eventHistory
          .slice(history)
          .filter((e) => e.type === "card-revealed");
        expect(events.map((e) => e.objectId)).toEqual(
          deck.slice(0, revealed).map((c) => c.objectId),
        );
        expect(p.zone("hand")).toHaveLength(hand.length - 2 + Number(found));
        if (found) expect(p.zone("hand")).toContainEqual(deck[position - 1]);
        const remaining = p.zone("main-deck");
        expect(remaining.slice(0, deck.length - revealed)).toEqual(deck.slice(revealed));
        expect(new Set(remaining.slice(deck.length - revealed).map((c) => c.objectId))).toEqual(
          new Set(deck.slice(0, revealed - Number(found)).map((c) => c.objectId)),
        );
        expect(remaining).toHaveLength(deck.length - Number(found));
        expect(q.zone("main-deck")).toEqual(otherDeck);
      });
    }
});
