import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fractalOfMana } from "./fractal-of-mana.ts";
import { yudiGossamerJade } from "./yudi-gossamer-jade.ts";

/** @covers l94wp7qjwb-a1 @covers l94wp7qjwb-a2 */
describe("Yudi, Gossamer Jade — root counters and attack tax", () => {
  it("gains a root counter from Empower and taxes non-tera attacks", () => {
    const { starter } = classBonusLeveledChampion(yudiGossamerJade, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          field: [yudiGossamerJade, fractalOfMana, woodlandSquirrels],
          hand: [woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const yudi = player.card(yudiGossamerJade, { zone: "field" });
    player.activateAbility(fractalOfMana, "szeb8zzj86-a2");
    passEffectsStack(game);
    expect(game.state.objects[yudi.objectId]!.counters["named:root"]).toBe(1);
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    const before = game.state;
    expect(() => player.declareAttack(ally, target)).toThrow();
    expect(game.state).toEqual(before);
    player.declareAttack(ally, target, {
      reservePayment: [
        { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
      ],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
  });
});
