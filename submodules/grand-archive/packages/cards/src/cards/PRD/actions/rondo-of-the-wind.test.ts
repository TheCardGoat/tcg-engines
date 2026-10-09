import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { rondoOfTheWind } from "./rondo-of-the-wind.ts";

/** @covers 4hbW1LvBRr-a1 */
describe("Rondo of the Wind — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: rondoOfTheWind, discount: 1 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 4hbW1LvBRr-a2 */
describe("Rondo of the Wind — Scavenge six for an ally", () => {
  for (const size of [0, 3, 9])
    for (const hasAlly of size === 0 ? [false] : [false, true])
      for (const seed of size === 0 ? [1] : [1, 2, 3, 4, 5, 6, 7, 8])
        it(`deck=${size}, ally=${hasAlly}, seed=${seed}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(rondoOfTheWind, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            randomSeed: seed,
            playerOne: {
              champion,
              zones: {
                hand: [rondoOfTheWind, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: size }, (_, i) =>
                  hasAlly && i === 0 ? woodlandSquirrels : sparkAlight,
                ),
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            deck = p.zone("main-deck"),
            opponentDeck = q.zone("main-deck");
          const match = deck
            .slice(0, 6)
            .findIndex((c) => c.definitionId === woodlandSquirrels.canonicalId);
          const revealed = deck.slice(0, match < 0 ? Math.min(6, size) : match + 1),
            chosen = match < 0 ? undefined : revealed.at(-1);
          const bottom = chosen ? revealed.slice(0, -1) : revealed,
            untouched = deck.slice(revealed.length);
          const history = game.state.eventHistory.length;
          p.activate(rondoOfTheWind, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(game.state.winnerIds).toEqual([]);
          expect(p.zone("hand")).toEqual(chosen ? [chosen] : []);
          expect(p.zone("main-deck").slice(0, untouched.length)).toEqual(untouched);
          expect(
            p
              .zone("main-deck")
              .slice(untouched.length)
              .map((c) => c.objectId)
              .sort(),
          ).toEqual(bottom.map((c) => c.objectId).sort());
          const events = game.state.eventHistory.slice(history);
          expect(events.filter((e) => e.type === "card-revealed").map((e) => e.objectId)).toEqual(
            revealed.map((c) => c.objectId),
          );
          expect(events.filter((e) => e.type === "random-state-changed")).toHaveLength(1);
          expect(p.zone("memory")).toHaveLength(4);
          expect(q.zone("main-deck")).toEqual(opponentDeck);
          expect(p.card(rondoOfTheWind, { zone: "graveyard" })).toBeDefined();
        });
});
