import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vantagePoint } from "../../RDO/actions/vantage-point.ts";
import { describe, expect, it } from "vitest";
import { draughtDodge } from "./draught-dodge.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers QFWIbwV25T-a1 */
describe("draughtDodge prevention", () => {
  proveUnitDamagePrevention({ card: draughtDodge, cost: 1, capacity: 2 });
});

/** @covers QFWIbwV25T-a2 */
describe("Draught Dodge — distant state and memory draw", () => {
  for (const matching of [false, true])
    for (const distant of [false, true])
      for (const own of [false, true])
        for (const ally of [false, true]) {
          it(`class=${matching}, distant=${distant}, own=${own}, ally=${ally}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(draughtDodge, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [woodlandSquirrels],
                  hand: [
                    vantagePoint,
                    draughtDodge,
                    ...Array.from({ length: 5 }, () => woodlandSquirrels),
                  ],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [woodlandSquirrels],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              owner = own ? p : q;
            const target = owner.card(ally ? woodlandSquirrels : champion, { zone: "field" });
            const other = owner.card(ally ? champion : woodlandSquirrels, { zone: "field" });
            const pay = (amount: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, amount)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (distant) {
              p.activate(vantagePoint, {
                targets: { "target-1": [target.objectId] },
                reservePayment: pay(2),
              });
              passEffectsStack(game);
            }
            expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(distant);
            const deck = p.zone("main-deck"),
              otherDeck = q.zone("main-deck");
            p.activate(draughtDodge, {
              targets: { "target-1": [target.objectId] },
              reservePayment: pay(1),
            });
            const memory = p.zone("memory"),
              hand = p.zone("hand");
            expect(p.zone("main-deck")).toEqual(deck);
            passEffectsStack(game);
            const draws = matching && distant;
            expect(p.zone("memory")).toEqual(draws ? [...memory, deck[0]!] : memory);
            expect(p.zone("main-deck")).toEqual(draws ? deck.slice(1) : deck);
            expect(p.zone("hand")).toEqual(hand);
            expect(q.zone("main-deck")).toEqual(otherDeck);
            expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(
              distant || matching,
            );
            expect(game.state.objects[other.objectId]!.states.has("distant")).toBe(false);
            advanceToMain(game, q.id);
            expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(
              !own && (distant || matching),
            );
            advanceToMain(game, p.id, game.state.turn.number);
            expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          });
        }
});
