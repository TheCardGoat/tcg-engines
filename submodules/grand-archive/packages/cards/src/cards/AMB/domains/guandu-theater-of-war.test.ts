import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { guanduTheaterOfWar } from "./guandu-theater-of-war.ts";

/** @covers 95ynk6lmnf-a1 */
describe("Guandu — ally attack counters", () => {
  it("puts a battle counter and draws into memory on the third resolution", () => {
    const { starter } = classBonusLeveledChampion(guanduTheaterOfWar, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          field: [guanduTheaterOfWar, woodlandSquirrels, woodlandSquirrels, automatedGardener],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const source = player.card(guanduTheaterOfWar, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    const attackers = [
      ...player.cards(woodlandSquirrels, { zone: "field" }),
      player.card(automatedGardener, { zone: "field" }),
    ];
    for (const [index, attacker] of attackers.entries()) {
      player.declareAttack(attacker, target);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-glimpse") {
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: game.state.decision.cardIds,
          bottom: [],
        });
      }
      passEffectsStack(game);
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[source.objectId]!.counters["named:battle"]).toBe(index + 1);
    }
    expect(player.zone("memory").length).toBeGreaterThanOrEqual(1);
  });
});

/** @covers 95ynk6lmnf-a2 */
describe("Guandu — Upkeep", () => {
  it("sacrifices without two battle counters and stays when they are removed", () => {
    const { starter } = classBonusLeveledChampion(guanduTheaterOfWar, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        zones: {
          field: [guanduTheaterOfWar],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const source = player.card(guanduTheaterOfWar, { zone: "field" });
    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  });
});
