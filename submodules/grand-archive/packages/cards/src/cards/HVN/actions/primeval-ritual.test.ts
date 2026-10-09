import { describe } from "vitest";
import { proveAllySacrificeCost } from "../../../testing/ally-sacrifice-cost.ts";
import { primevalRitual } from "./primeval-ritual.ts";

/** @covers fan41iqm8b-a1 */
describe("primeval-ritual — additional ally sacrifice", () => {
  proveAllySacrificeCost(primevalRitual, 3, true);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { windstreamMutt } from "../../DOA/allies/windstream-mutt.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";

/** @covers fan41iqm8b-a2 */
describe("Primeval Ritual — a pre-existing own wind graveyard target", () => {
  for (const matching of [false, true])
    for (const card of [reclaim, windstreamMutt])
      for (const removed of [false, true]) {
        it(`returns only the declared card to memory: class=${matching}, card=${card.slug}, removed=${removed}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(primevalRitual, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [windstreamMutt],
                hand: [
                  primevalRitual,
                  card,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                graveyard: [card, card, woodlandSquirrels],
                banishment: [card],
                memory: [card],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: [card], hand: [tombSweep, woodlandSquirrels, woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const donor = p.card(windstreamMutt, { zone: "field" });
          const [target, other] = p.cards(card, { zone: "graveyard" });
          const options = {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            costSelections: [[donor.objectId]],
          };
          const before = game.state;
          for (const ids of [
            [],
            [donor.objectId],
            [q.card(card, { zone: "graveyard" }).objectId],
            [p.card(card, { zone: "hand" }).objectId],
            [p.card(card, { zone: "banishment" }).objectId],
            [p.card(card, { zone: "memory" }).objectId],
            [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
            [target!.objectId, other!.objectId],
          ]) {
            expect(() =>
              p.activate(primevalRitual, { ...options, targets: { "target-card": ids } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(primevalRitual, {
            ...options,
            targets: { "target-card": [target!.objectId] },
          });
          expect(game.state.objects[donor.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[target!.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(4);
          if (removed) {
            p.pass();
            q.activate(tombSweep, {
              reservePayment: q
                .cards(woodlandSquirrels)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-card": [target!.objectId] },
            });
          }
          passEffectsStack(game);
          expect(game.state.objects[target!.objectId]!.zone).toBe(
            removed ? "banishment" : "memory",
          );
          expect(p.zone("memory")).toHaveLength(removed ? 4 : 5);
          expect(game.state.objects[other!.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[donor.objectId]!.zone).toBe("graveyard");
          expect(q.card(card, { zone: "graveyard" })).toBeDefined();
          expect(p.card(primevalRitual, { zone: "graveyard" })).toBeDefined();
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
        });
      }
});
