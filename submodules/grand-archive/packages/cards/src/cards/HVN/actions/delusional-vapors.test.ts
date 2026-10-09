import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { delusionalVapors } from "./delusional-vapors.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { plantedExplosive } from "../../P26/actions/planted-explosive.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { arcaneDisposition } from "../../DOA/actions/arcane-disposition.ts";
import { baubleOfMending } from "../../DOA/items/bauble-of-mending.ts";
/** @covers 2ghdzy9tz7-a1
 * @covers 2ghdzy9tz7-a2
 */
describe("Delusional Vapors — Class Bonus Prepare and per-card draw milling", () => {
  for (const matching of [false, true])
    for (const counters of [0, 1, 2, 3])
      for (const prepare of [false, true])
        it(`class=${matching}, counters=${counters}, prepare=${prepare}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(delusionalVapors, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  delusionalVapors,
                  acceptedContract,
                  plantedExplosive,
                  plantedExplosive,
                  ...Array.from({ length: 12 }, () => woodlandSquirrels),
                ],
                field: [baubleOfMending],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              preserveMainDeckOrder: true,
              zones: {
                hand: [arcaneDisposition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                field: [baubleOfMending],
                "main-deck": Array.from({ length: 40 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (counters > 0) {
            p.activate(acceptedContract, { reservePayment: pay(5) });
            passEffectsStack(game);
            for (let i = counters; i < 3; i++) {
              p.activate(p.cards(plantedExplosive, { zone: "hand" })[0]!, {
                reservePayment: pay(2),
                prepareAbilityIndexes: [0],
                targets: { "target-1": [hero.objectId] },
              });
              passEffectsStack(game);
            }
          }
          advanceToMain(game, q.id);
          const deck = q.zone("main-deck");
          q.activate(arcaneDisposition, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          q.pass();
          const options = {
              reservePayment: pay(3),
              targets: { "target-opponent": [q.id] },
              ...(prepare ? { prepareAbilityIndexes: [0] as const } : {}),
            },
            before = game.state;
          if (prepare && (!matching || counters < 2)) {
            expect(() => p.activate(delusionalVapors, options)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          expect(() =>
            p.activate(delusionalVapors, { ...options, targets: { "target-opponent": [p.id] } }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(delusionalVapors, options);
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
            counters - (prepare ? 2 : 0),
          );
          for (let i = 0; i < 16 && game.state.stack.length > 1; i++) {
            const w = game.waitState();
            if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
            game.player(w.playerId).pass();
          }
          expect(q.zone("main-deck")).toEqual(deck.slice(8));
          expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(8);
          const settle = () => {
            for (let i = 0; i < 64 && (game.state.stack.length || game.state.decision); i++) {
              const d = game.state.decision;
              if (d?.kind === "order-triggered-abilities")
                answerDecision(game, d.kind, d.pendingTriggerIds);
              else {
                const w = game.waitState();
                if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
                game.player(w.playerId).pass();
              }
            }
          };
          settle();
          expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(
            8 + (prepare ? 8 : 0),
          );
          expect(q.zone("main-deck")).toEqual(deck.slice(10 + (prepare ? 8 : 0)));
          const priority = (id: typeof p.id) => {
            for (let i = 0; i < 4; i++) {
              const w = game.waitState();
              if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
              if (w.playerId === id) return;
              game.player(w.playerId).pass();
            }
          };
          const remaining = q.zone("main-deck");
          priority(p.id);
          p.activateAbility(baubleOfMending, "hLHpI5rHIK-a1");
          settle();
          expect(q.zone("main-deck")).toEqual(remaining);
          priority(q.id);
          q.activateAbility(baubleOfMending, "hLHpI5rHIK-a1");
          settle();
          expect(q.zone("main-deck")).toEqual(remaining.slice(prepare ? 5 : 1));
          expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(
            8 + (prepare ? 12 : 0),
          );
          const endDeck = q.zone("main-deck"),
            endGrave = q.cards(woodlandSquirrels, { zone: "graveyard" }).length,
            endHand = q.zone("hand").length;
          advanceToMain(game, q.id, game.state.turn.number);
          expect(q.zone("main-deck")).toEqual(endDeck.slice(1));
          // Arcane Disposition discards the opponent's hand at end phase; no extra mill on the later draw.
          expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(
            endGrave + endHand,
          );
        });
});
