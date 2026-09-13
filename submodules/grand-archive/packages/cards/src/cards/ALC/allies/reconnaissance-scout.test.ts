import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { supplyDrone } from "./supply-drone.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { fraysia } from "../tokens/fraysia.ts";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { reconnaissanceScout } from "./reconnaissance-scout.ts";

/** @covers lwuupowx4p-a2 */
describe("reconnaissance-scout — Ranged", () => {
  proveRangedAlly({ card: reconnaissanceScout, power: 1, ranged: 2, classBonus: false });
});

/** @covers lwuupowx4p-a1 @covers lwuupowx4p-a3 */
describe("Reconnaissance Scout — targeted distant and one-point protection", () => {
  for (const classBonus of [false, true]) {
    for (const championTarget of [false, true]) {
      for (const expired of [false, true]) {
        it(`Class Bonus=${classBonus}, champion=${championTarget}, expired=${expired}`, () => {
          const champion = createClassBonusTestChampion(
            reconnaissanceScout,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: expired ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [supplyDrone, fraysia],
                hand: [reconnaissanceScout, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [automatedGardener, automatedGardener],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          if (!expired) opponent.pass();
          player.activate(reconnaissanceScout, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          });
          for (
            let step = 0;
            player.cards(reconnaissanceScout, { zone: "field" }).length === 0 && step < 8;
            step++
          ) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          const scout = player.card(reconnaissanceScout, { zone: "field" });
          const target = player.card(championTarget ? champion : supplyDrone);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          if (classBonus) {
            for (const invalid of [
              scout,
              player.card(fraysia),
              opponent.cards(automatedGardener)[0]!,
            ]) {
              const before = game.state;
              expect(() =>
                answerDecision(game, "announce-triggered-ability", {
                  targets: { "target-1": [invalid.objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [target.objectId] },
            });
            expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          }
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(classBonus);
          expect(game.state.objects[scout.objectId]!.states.has("distant")).toBe(false);
          if (expired) {
            advanceToRecollection(game, opponent.id);
            for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          }
          const protectedNow = classBonus && !expired;
          const attackers = opponent.cards(automatedGardener);
          for (const [index, attacker] of attackers.entries()) {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
              game.player(wait.playerId).pass();
            opponent.declareAttack(attacker, target);
            game.resolveCombatWithoutRetaliation();
            const damage = (index + 1) * 2 - (protectedNow ? 1 : 0);
            if (!championTarget && damage === 4)
              expect(player.zone("graveyard")).toContainEqual(target);
            else expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          }
        });
      }
    }
  }
});
