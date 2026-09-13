import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { carterSyntheticReaper } from "./carter-synthetic-reaper.ts";
import { supplyDrone } from "./supply-drone.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { caretakerDrone } from "./caretaker-drone.ts";

/** @covers 1wl8ao8bls-a1 */
describe("Carter — Class Bonus Cleave", () => {
  for (const classBonus of [false, true]) {
    it(`requires matching class (${classBonus}) and damages every declared defender without interception`, () => {
      const champion = createClassBonusTestChampion(
        carterSyntheticReaper,
        classBonus,
        "activation-discount",
      );
      const defender = createClassBonusTestChampion(
        carterSyntheticReaper,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [carterSyntheticReaper, supplyDrone] } },
        playerTwo: {
          champion: defender,
          zones: { field: [supplyDrone, automatedGardener, caretakerDrone] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const carter = player.card(carterSyntheticReaper);
      const target = opponent.card(defender);
      const intercept = opponent.card(caretakerDrone);
      const declareCleave = () =>
        player.execute({
          move: "declare-attack",
          attackerId: carter.objectId,
          targetIds: [],
          cleavePlayerId: opponent.id,
        });
      if (!classBonus) {
        const before = game.state;
        expect(declareCleave).toThrow();
        expect(game.state).toEqual(before);
        player.declareAttack(carter, target);
        expect(game.state.stack.some((item) => item.sourceId === intercept.objectId)).toBe(true);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
      } else {
        declareCleave();
        expect(new Set(game.state.combat?.targetIds)).toEqual(
          new Set(opponent.zone("field").map((ref) => ref.objectId)),
        );
        expect(game.state.stack.some((item) => item.sourceId === intercept.objectId)).toBe(false);
      }
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      expect(game.state.objects[opponent.card(supplyDrone).objectId]!.damage).toBe(0);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
      expect(game.state.objects[opponent.card(supplyDrone).objectId]!.damage).toBe(
        classBonus ? 2 : 0,
      );
      expect(game.state.objects[opponent.card(automatedGardener).objectId]!.damage).toBe(
        classBonus ? 2 : 0,
      );
      expect(opponent.zone("graveyard")).toEqual(classBonus ? [intercept] : []);
      expect(game.state.objects[player.card(supplyDrone).objectId]!.damage).toBe(0);
    });
  }
});

/** @covers 1wl8ao8bls-a2 */
describe("Carter — every ally death recovers one", () => {
  for (const victim of ["own", "opposing", "self", "surviving"] as const) {
    for (const damaged of [false, true]) {
      it(`observes ${victim}, with champion damage=${damaged}`, () => {
        const champion = createClassBonusTestChampion(
          carterSyntheticReaper,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: victim === "opposing" ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [carterSyntheticReaper, woodlandSquirrels, supplyDrone, automatedGardener],
              hand: damaged ? [umbraSight] : [],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [automatedGardener, automatedGardener, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion);
        if (damaged) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id) opponent.pass();
          player.activate(umbraSight);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
        const initialDamage = damaged ? 2 : 0;
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(initialDamage);
        const attackingPlayer = victim === "opposing" ? player : opponent;
        const target =
          victim === "opposing"
            ? opponent.card(woodlandSquirrels)
            : player.card(
                victim === "self"
                  ? carterSyntheticReaper
                  : victim === "surviving"
                    ? supplyDrone
                    : woodlandSquirrels,
                { zone: "field" },
              );
        const attackers = attackingPlayer.cards(automatedGardener);
        const ready = () => {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== attackingPlayer.id)
            game.player(wait.playerId).pass();
        };
        ready();
        attackingPlayer.declareAttack(attackers[0]!, target);
        if (victim === "self") {
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(initialDamage);
          expect(game.state.objects[target.objectId]!.damage).toBe(2);
          ready();
          attackingPlayer.declareAttack(attackers[1]!, target);
        }
        advanceCombatToTrigger(game, "1wl8ao8bls-a2");
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(initialDamage);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "1wl8ao8bls-a2",
          ),
        ).toBe(victim !== "surviving");
        passEffectsStack(game);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(
          Math.max(0, initialDamage - (victim === "surviving" ? 0 : 1)),
        );
        expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(0);
        if (victim !== "surviving")
          expect((victim === "opposing" ? opponent : player).zone("graveyard")).toContainEqual(
            target,
          );
        else expect(game.state.objects[target.objectId]!.damage).toBe(2);
      });
    }
  }
});

/** @covers 1wl8ao8bls-a3 */
describe("Carter — optional entry sacrifice", () => {
  for (const sacrifice of ["none", "ordinary", "automaton"] as const) {
    for (const accept of [false, true]) {
      for (const expired of [false, true]) {
        it(`${sacrifice}, accept=${accept}, expired=${expired}`, () => {
          const champion = createClassBonusTestChampion(
            carterSyntheticReaper,
            false,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [carterSyntheticReaper, woodlandSquirrels, woodlandSquirrels],
                field: sacrifice === "none" ? [] : [woodlandSquirrels, automatedGardener],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [automatedGardener],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const player = game.player("player-one");
          player.activate(carterSyntheticReaper, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          });
          const deck = player.zone("main-deck");
          player.pass();
          game.player("player-two").pass();
          const carter = player.card(carterSyntheticReaper, { zone: "field" });
          expect(player.zone("graveyard")).toHaveLength(0);
          expect(player.zone("hand")).toHaveLength(0);
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-optional-effect")
            answerDecision(game, "resolve-optional-effect", accept);
          const performed = accept && sacrifice !== "none";
          if (performed) {
            for (const invalid of [
              carter,
              player.card(champion),
              game.player("player-two").card(automatedGardener),
            ]) {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const selected = player.card(
              sacrifice === "automaton" ? automatedGardener : woodlandSquirrels,
              { zone: "field" },
            );
            answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            passEffectsStack(game);
            expect(player.zone("graveyard")).toEqual([selected]);
          } else {
            passEffectsStack(game);
            expect(player.zone("graveyard")).toHaveLength(0);
          }
          expect(player.zone("hand")).toEqual(
            performed && sacrifice === "automaton" ? [deck[0]] : [],
          );
          expect(player.zone("main-deck")).toEqual(
            performed && sacrifice === "automaton" ? deck.slice(1) : deck,
          );
          if (expired) {
            advanceToRecollection(game, "player-two");
            advanceToRecollection(game, "player-one");
            for (let step = 0; game.state.turn.phase !== "main" && step < 10; step++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          const target = game.player("player-two").card(champion);
          player.declareAttack(carter, target);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(performed && !expired ? 4 : 2);
        });
      }
    }
  }
});
