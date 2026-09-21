import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tweedledeeContrarianPoet } from "./tweedledee-contrarian-poet.ts";

/** @covers EwUKdNL4bk-a1 */
describe("Tweedledee, Contrarian Poet — Class Bonus Taunt", () => {
  for (const classBonus of [false, true]) {
    it(`constrains attacks only while Class Bonus is ${classBonus ? "enabled" : "disabled"}`, () => {
      const champion = createClassBonusTestChampion(
        tweedledeeContrarianPoet,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [tweedledeeContrarianPoet, woodlandSquirrels] } },
        playerTwo: { champion, zones: { field: [automatedGardener] } },
      });
      const defender = game.player("player-one");
      const attacker = game.player("player-two");
      const source = defender.card(tweedledeeContrarianPoet);
      const other = defender.card(woodlandSquirrels);
      if (classBonus) {
        const before = game.state;
        expect(() => attacker.declareAttack(automatedGardener, other)).toThrow();
        expect(game.state).toEqual(before);
        attacker.declareAttack(automatedGardener, source);
      } else {
        attacker.declareAttack(automatedGardener, other);
      }
      game.resolveCombatWithoutRetaliation();
      if (classBonus) expect(game.state.objects[source.objectId]!.damage).toBe(2);
      else expect(game.state.objects[other.objectId]!.zone).toBe("graveyard");
    });
  }
});

/** @covers EwUKdNL4bk-a2 */
describe("Tweedledee, Contrarian Poet — permanent On Hit penalty", () => {
  it("keeps the permanent -3 power after the turn ends", () => {
    const champion = createClassBonusTestChampion(
      tweedledeeContrarianPoet,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [tweedledeeContrarianPoet],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(champion);
    player.declareAttack(tweedledeeContrarianPoet, target);
    game.resolveCombatWithoutRetaliation();
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    const firstTurn = game.state.turn.number;
    advanceToMain(game, player.id, firstTurn);
    const before = game.state;
    expect(() => player.declareAttack(tweedledeeContrarianPoet, target)).toThrow(
      /cannot declare an attack/i,
    );
    expect(game.state).toEqual(before);
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
  });
});
