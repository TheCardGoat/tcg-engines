import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveReservable } from "../../../testing/reservable.ts";
import { explosiveFractal } from "./explosive-fractal.ts";

/** @covers 1d47o7eanl-a2 */
describe("Explosive Fractal — Reservable", () => {
  proveReservable(explosiveFractal);
});

/** @covers 1d47o7eanl-a1 */
describe("Explosive Fractal — conditional entry damage", () => {
  for (const classBonus of [false, true]) {
    for (const memoryAfterPayment of [3, 4, 5]) {
      for (const targetOwner of ["player-one", "player-two"] as const) {
        it(`deals entry damage with Class Bonus ${classBonus}, memory ${memoryAfterPayment}, target ${targetOwner}`, () => {
          const champion = createClassBonusTestChampion(
            explosiveFractal,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [explosiveFractal, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                memory: Array.from({ length: memoryAfterPayment - 3 }, () => woodlandSquirrels),
                field: [woodlandSquirrels],
              },
            },
            playerTwo: { champion },
          });
          const player = game.player("player-one");
          const target = game.player(targetOwner).card(champion, { zone: "field" });
          player.activate(explosiveFractal, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          });
          expect(player.zone("memory")).toHaveLength(memoryAfterPayment);
          expect(player.cards(explosiveFractal, { zone: "field" })).toHaveLength(0);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          const enabled = classBonus && memoryAfterPayment >= 4;
          expect(game.state.decision?.kind === "announce-triggered-ability").toBe(enabled);
          expect(player.cards(explosiveFractal, { zone: "field" })).toHaveLength(1);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          if (enabled) {
            const before = game.state.stateVersion;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: {
                  "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId],
                },
              }),
            ).toThrow();
            expect(game.state.stateVersion).toBe(before);
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [target.objectId] },
            });
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            passEffectsStack(game);
          }
          expect(game.state.objects[target.objectId]!.damage).toBe(enabled ? 2 : 0);
          const other = game
            .player(targetOwner === "player-one" ? "player-two" : "player-one")
            .card(champion, { zone: "field" });
          expect(game.state.objects[other.objectId]!.damage).toBe(0);
        });
      }
    }
  }
});
