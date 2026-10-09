import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vantagePoint } from "./vantage-point.ts";
import { splashingPerch } from "./splashing-perch.ts";
/** @covers ba08K8VZnF-a1 */
describe("Splashing Perch — distant or draw", () => {
  for (const matching of [false, true])
    for (const ownTurn of [false, true])
      for (const stacked of [false, true]) {
        it(`class=${matching}, own turn=${ownTurn}, stacked=${stacked}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(splashingPerch, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: ownTurn ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  vantagePoint,
                  splashingPerch,
                  splashingPerch,
                  splashingPerch,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion);
          const pay = (amount: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, amount)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (!ownTurn) q.pass();
          p.activate(vantagePoint, {
            targets: { "target-1": [q.card(champion).objectId] },
            reservePayment: pay(2),
          });
          passEffectsStack(game);
          if (!ownTurn) q.pass();
          const deck = p.zone("main-deck"),
            cards = p.cards(splashingPerch, { zone: "hand" });
          p.activate(cards[0]!, { reservePayment: pay(1) });
          expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
          if (!stacked) {
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
            expect(p.zone("main-deck")).toEqual(deck);
            if (!ownTurn) q.pass();
          }
          p.activate(cards[1]!, { reservePayment: pay(1) });
          const hand = p.zone("hand"),
            memory = p.zone("memory");
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
          expect(p.zone("hand")).toEqual([...hand, deck[0]!]);
          expect(p.zone("memory")).toEqual(memory);
          expect(p.zone("main-deck")).toEqual(deck.slice(1));
          if (!ownTurn) {
            advanceToMain(game, p.id);
            expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
          }
          advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
          const laterDeck = p.zone("main-deck");
          p.activate(cards[2]!, { reservePayment: pay(1) });
          passEffectsStack(game);
          expect(p.zone("main-deck")).toEqual(laterDeck);
          expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
        });
      }
});
