import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { diluAuspiciousCharger } from "./dilu-auspicious-charger.ts";
import { catoMeadowsChanneler } from "./cato-meadows-channeler.ts";

/** @covers du4eaktghh-a1 */
describe("Dilu, Auspicious Charger — Pride 3", () => {
  provePrideAlly({ card: diluAuspiciousCharger, pride: 3, power: 3 });
});

/** @covers du4eaktghh-a2 */
describe("Dilu, Auspicious Charger — Human rider bonus", () => {
  it("loses Pride and wakes from Vigor with a wind unique Human ally", () => {
    const champion = lineageTestChampion("Dilu", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [diluAuspiciousCharger, catoMeadowsChanneler],
          "main-deck": [catoMeadowsChanneler, catoMeadowsChanneler],
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": [catoMeadowsChanneler, catoMeadowsChanneler] },
      },
    });
    const player = game.player("player-one");
    player.declareAttack(diluAuspiciousCharger, game.player("player-two").card(champion));
    game.resolveCombatWithoutRetaliation();
    const source = player.card(diluAuspiciousCharger);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    for (let step = 0; game.state.turn.phase !== "end" && step < 64; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
  });
});
