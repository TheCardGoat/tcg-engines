import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { lenaDorumegiasHerald } from "./lena-dorumegias-herald.ts";
import { shadecursedHunter } from "./shadecursed-hunter.ts";

/** @covers oqk2c7wklz-a1 */
describe("Shadecursed Hunter — Ranged 5 and Stealth", () => {
  proveRangedAlly({ card: shadecursedHunter, power: 2, ranged: 5, classBonus: false });
  for (const trueSight of [false, true]) {
    it(`requires True Sight (${trueSight}) to attack its Stealth`, () => {
      const champion = createClassBonusTestChampion(
        shadecursedHunter,
        false,
        "activation-discount",
      );
      const attackerChampion = createClassBonusTestChampion(
        lenaDorumegiasHerald,
        trueSight,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [shadecursedHunter] } },
        playerTwo: { champion: attackerChampion, zones: { field: [lenaDorumegiasHerald] } },
      });
      const defender = game.player("player-one");
      const attacker = game.player("player-two");
      const hunter = defender.card(shadecursedHunter);
      if (!trueSight) {
        const before = game.state;
        expect(() => attacker.declareAttack(lenaDorumegiasHerald, hunter)).toThrow();
        expect(game.state).toEqual(before);
        attacker.declareAttack(lenaDorumegiasHerald, defender.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[defender.card(champion).objectId]!.damage).toBe(1);
        expect(defender.cards(shadecursedHunter, { zone: "field" })).toEqual([hunter]);
      } else {
        attacker.declareAttack(lenaDorumegiasHerald, hunter);
        game.resolveCombatWithoutRetaliation();
        expect(defender.cards(shadecursedHunter, { zone: "field" })).toHaveLength(0);
      }
    });
  }
});

/** @covers oqk2c7wklz-a2 @covers oqk2c7wklz-a3 */
describe("Shadecursed Hunter — death lineage and inherited life", () => {
  for (const deaths of [0, 1, 2]) {
    for (const damaged of [false, true]) {
      it(`${deaths} Hunter deaths, champion starts with ${damaged ? 12 : 0} damage`, () => {
        const champion = createClassBonusTestChampion(
          shadecursedHunter,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [shadecursedHunter, shadecursedHunter, woodlandSquirrels],
              hand: damaged ? [umbraSight, umbraSight, umbraSight] : [],
              "main-deck": Array.from({ length: 9 }, () => woodlandSquirrels),
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
        for (let index = 0; index < (damaged ? 3 : 0); index++) {
          player.activate(player.cards(umbraSight, { zone: "hand" })[0]!);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damaged ? 12 : 0);
        expect(game.state.players[player.id]!.lost).toBe(false);
        const hunters = player.cards(shadecursedHunter);
        const defenders = opponent.cards(automatedGardener);
        const victims =
          deaths === 0
            ? [player.card(woodlandSquirrels, { zone: "field" })]
            : hunters.slice(0, deaths);
        for (const [index, victim] of victims.entries()) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          const lineage = player.zone("inner-lineage");
          player.declareAttack(victim, defenders[index]!);
          for (let step = 0; step < 64; step++) {
            if (
              game.state.stack.some(
                (item) => item.kind === "triggered-ability" && item.ability.id === "oqk2c7wklz-a2",
              ) ||
              !game.state.combat
            )
              break;
            if (game.state.decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", [defenders[index]!.objectId]);
            else {
              const next = game.waitState();
              if (next.kind !== "opportunity") throw new Error(`Unexpected ${next.kind}`);
              game.player(next.playerId).pass();
            }
          }
          expect(player.zone("graveyard")).toContainEqual(victim);
          expect(player.zone("inner-lineage")).toEqual(lineage);
          expect(game.state.players[player.id]!.lost).toBe(false);
          expect(
            game.state.stack.filter(
              (item) => item.kind === "triggered-ability" && item.ability.id === "oqk2c7wklz-a2",
            ),
          ).toHaveLength(deaths > 0 ? 1 : 0);
          passEffectsStack(game);
          const lethalPenalty = damaged && deaths === 2 && index === 1;
          if (!lethalPenalty) {
            expect(player.zone("inner-lineage")).toEqual(
              deaths > 0 ? [...lineage, victim] : lineage,
            );
            if (deaths > 0)
              expect(game.state.objects[victim.objectId]!.hostId).toBe(ownChampion.objectId);
          }
          expect(game.state.players[player.id]!.lost).toBe(lethalPenalty);
          if (!lethalPenalty && game.state.combat) game.resolveCombatWithoutRetaliation();
        }
        if (damaged && deaths < 2) {
          advanceToRecollection(game, opponent.id);
          for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          opponent.declareAttack(opponent.card(woodlandSquirrels, { zone: "field" }), ownChampion);
          for (
            let step = 0;
            game.state.combat && !game.state.players[player.id]!.lost && step < 64;
            step++
          ) {
            if (game.state.decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", []);
            else {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          // One inherited -2 LIFE makes 13 lethal; Hunters outside lineage do not.
          expect(game.state.players[player.id]!.lost).toBe(deaths === 1);
        }
        expect(game.state.players[opponent.id]!.lost).toBe(false);
      });
    }
  }
});
