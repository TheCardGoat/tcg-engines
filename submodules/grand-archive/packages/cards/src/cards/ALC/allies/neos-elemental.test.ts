import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { neosElemental } from "./neos-elemental.ts";
import { shimmercloakAssassin } from "./shimmercloak-assassin.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";

function reachMain(game: GrandArchiveTestEngine) {
  for (let step = 0; game.state.turn.phase !== "main" && step < 24; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.turn.phase).toBe("main");
}

/** @covers jwsl7dedg6-a1 */
describe("Neos Elemental — token-scaled activation discount", () => {
  for (const classBonus of [false, true]) {
    for (const tokens of [0, 2, 11]) {
      it(`Class Bonus=${classBonus}, controlled tokens=${tokens}`, () => {
        const champion = createClassBonusTestChampion(
          neosElemental,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [neosElemental, ...Array.from({ length: 10 }, () => woodlandSquirrels)],
              field: [
                woodlandSquirrels,
                automatedGardener,
                ...Array.from({ length: tokens }, (_, i) =>
                  i % 2 === 0 ? manaroot : automatonDrone,
                ),
              ],
            },
          },
          playerTwo: { champion, zones: { field: [manaroot, automatonDrone] } },
        });
        const player = game.player("player-one");
        const source = player.card(neosElemental);
        const cost = classBonus ? Math.max(0, 10 - tokens) : 10;
        const payment = player.cards(woodlandSquirrels, { zone: "hand" }).slice(0, cost);
        if (cost > 0) {
          const before = game.state;
          expect(() =>
            player.activate(source, {
              reservePayment: payment
                .slice(1)
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        player.activate(source, {
          reservePayment: payment.map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        expect(player.zone("memory")).toEqual(payment);
        expect(player.cards(neosElemental, { zone: "field" })).toHaveLength(0);
        passEffectsStack(game);
        expect(player.cards(neosElemental, { zone: "field" })).toEqual([source]);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      });
    }
  }
});

/** @covers jwsl7dedg6-a3 */
describe("Neos Elemental — Steadfast, Taunt, True Sight, and Vigor", () => {
  for (const classBonus of [false, true]) {
    for (const rested of [false, true]) {
      it(`Class Bonus=${classBonus}, retaliates while rested=${rested}`, () => {
        const champion = createClassBonusTestChampion(
          neosElemental,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: rested ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [neosElemental, manaroot, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: createClassBonusTestChampion(glacialGuidance, false, "activation-discount"),
            zones: {
              hand: [glacialGuidance, woodlandSquirrels],
              field: [shimmercloakAssassin, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ally = player.card(neosElemental);
        if (!rested) {
          advanceToRecollection(game, opponent.id);
          advanceToRecollection(game, player.id);
          reachMain(game);
          const stealth = opponent.card(shimmercloakAssassin);
          const before = game.state;
          expect(() =>
            player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), stealth),
          ).toThrow();
          expect(game.state).toEqual(before);
          player.declareAttack(ally, stealth);
          game.resolveCombatWithoutRetaliation();
          expect(opponent.zone("graveyard")).toEqual([stealth]);
          expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
          for (let step = 0; game.state.turn.phase !== "end" && step < 24; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          expect(game.state.turn.phase).toBe("end");
          expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.stack.filter((item) => item.kind === "triggered-ability")).toHaveLength(
            1,
          );
          passEffectsStack(game);
          expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(false);
          advanceToRecollection(game, opponent.id);
          reachMain(game);
        }
        if (rested) {
          opponent.activate(glacialGuidance, {
            targets: { "target-1": [ally.objectId] },
            reservePayment: [
              { kind: "card", cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
          passEffectsStack(game);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
            game.player(wait.playerId).pass();
        }
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(rested);
        const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
        if (rested) {
          // Rested Taunt does not protect the champion.
          opponent.declareAttack(attackers[0]!, player.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(1);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
            game.player(wait.playerId).pass();
        } else {
          for (const target of [
            player.card(champion),
            player.card(woodlandSquirrels, { zone: "field" }),
          ]) {
            const before = game.state;
            expect(() => opponent.declareAttack(attackers[0]!, target)).toThrow();
            expect(game.state).toEqual(before);
          }
        }
        const attacker = attackers[1]!;
        opponent.declareAttack(attacker, ally);
        let retaliated = false;
        for (let step = 0; game.state.combat && step < 40; step++) {
          const wait = game.waitState();
          if (game.state.decision?.kind === "choose-retaliators") {
            answerDecision(game, "choose-retaliators", [ally.objectId]);
            retaliated = true;
          } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected ${wait.kind}`);
        }
        expect(retaliated).toBe(true);
        expect(game.state.combat).toBeNull();
        expect(opponent.zone("graveyard")).toContainEqual(attacker);
        expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(rested);
      });
    }
  }
});

/** @covers jwsl7dedg6-a4 */
describe("Neos Elemental — dynamic token power and life", () => {
  for (const classBonus of [false, true]) {
    for (const tokens of [false, true]) {
      it(`Class Bonus=${classBonus}, allied token objects=${tokens ? 2 : 0}`, () => {
        const champion = createClassBonusTestChampion(
          neosElemental,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                neosElemental,
                woodlandSquirrels,
                ...(tokens ? [manaroot, automatonDrone] : []),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [automatedGardener, woodlandSquirrels, manaroot, automatonDrone],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ally = player.card(neosElemental);
        advanceToRecollection(game, opponent.id);
        advanceToRecollection(game, player.id);
        reachMain(game);
        player.declareAttack(ally, opponent.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(tokens ? 3 : 1);
        advanceToRecollection(game, opponent.id);
        reachMain(game);
        opponent.declareAttack(tokens ? automatedGardener : woodlandSquirrels, ally);
        game.resolveCombatWithoutRetaliation();
        expect(player.cards(neosElemental, { zone: "field" })).toHaveLength(tokens ? 1 : 0);
        if (tokens) {
          expect(game.state.objects[ally.objectId]!.damage).toBe(2);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          player.activateAbility(manaroot, "5joh300z2s-a1");
          // Losing the token drops life from three to two immediately, before the Herb resolves.
          expect(player.cards(neosElemental, { zone: "field" })).toHaveLength(0);
          expect(game.state.stack).toHaveLength(1);
          passEffectsStack(game);
        }
        expect(player.zone("graveyard")).toEqual([ally]);
      });
    }
  }
});
