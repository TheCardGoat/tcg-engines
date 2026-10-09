import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { torRealmwalkerColossus } from "./tor-realmwalker-colossus.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { stockedOutpost } from "./stocked-outpost.ts";
import { glacierRemnants } from "./glacier-remnants.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers YKrCbNs3rh-a1
 * @covers YKrCbNs3rh-a2
 * @covers YKrCbNs3rh-a3
 */
describe("Tor, Realmwalker Colossus", () => {
  for (const classBonus of [false, true])
    for (const count of [0, 1, 2, 3]) {
      it(`attacks with power from durability, sacrificed=${count}, Class Bonus=${classBonus}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(torRealmwalkerColossus, classBonus, "activation-discount"),
        );
        const domains = [stockedOutpost, glacierRemnants, stockedOutpost].slice(0, count);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                torRealmwalkerColossus,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              field: domains,
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [stockedOutpost, giantTortoise],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(torRealmwalkerColossus),
          targets = [...p.cards(stockedOutpost), ...p.cards(glacierRemnants)].map(
            (ref) => ref.objectId,
          );
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        passEffectsStack(game);
        if (classBonus) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(stockedOutpost).objectId]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", targets);
          passEffectsStack(game);
        }
        const durability = 4 + (classBonus ? [0, 4, 9, 13][count]! : 0);
        expect(game.state.objects[source.objectId]!.counters.durability).toBe(durability);
        for (const id of targets)
          expect(game.state.objects[id]!.zone).toBe(classBonus ? "graveyard" : "field");
        expect(game.state.objects[q.card(stockedOutpost).objectId]!.zone).toBe("field");
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(power()).toBe(Math.floor(durability / 4));
        advanceToMain(game, q.id, -1, true);
        q.declareAttack(q.card(giantTortoise), source);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[source.objectId]!.counters.durability).toBe(durability - 1);
        expect(power()).toBe(Math.floor((durability - 1) / 4));
        // Entering this turn prevents an attack; advance through public phases.
        advanceToMain(game, p.id, game.state.turn.number, true);
        if (durability < 5) {
          const before = game.state;
          expect(() => p.declareAttack(source, q.card(champion))).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          Math.floor((durability - 1) / 4),
        );
      });
    }
});
