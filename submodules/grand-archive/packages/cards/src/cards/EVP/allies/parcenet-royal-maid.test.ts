import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { catoMeadowsChanneler } from "./cato-meadows-channeler.ts";
import { parcenetRoyalMaid } from "./parcenet-royal-maid.ts";

/** @covers xxoo7dl5j4-a1 */
describe("Parcenet, Royal Maid — Level 2+ Stealth", () => {
  for (const level of [1, 2]) {
    it(`${level >= 2 ? "blocks" : "allows"} attacks at level ${level}`, () => {
      const champion = lineageTestChampion("Parcenet", 0);
      const attackerChampion = lineageTestChampion("Parcenet opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          lineage: Array.from({ length: level }, (_, index) =>
            lineageTestChampion("Parcenet", index + 1),
          ),
          zones: { field: [parcenetRoyalMaid] },
        },
        playerTwo: { champion: attackerChampion, zones: { field: [woodlandSquirrels] } },
      });
      const attacker = game.player("player-two");
      const before = game.state;
      if (level >= 2) {
        expect(() => attacker.declareAttack(woodlandSquirrels, parcenetRoyalMaid)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        attacker.declareAttack(woodlandSquirrels, parcenetRoyalMaid);
        expect(game.state.combat?.targetIds).toEqual([
          game.player("player-one").card(parcenetRoyalMaid).objectId,
        ]);
      }
    });
  }
});

/** @covers xxoo7dl5j4-a2 */
describe("Parcenet, Royal Maid — Glimpse and wind reveal", () => {
  for (const wind of [false, true]) {
    it(`${wind ? "grants" : "does not grant"} Stealth after the reveal`, () => {
      const champion = lineageTestChampion("Parcenet", 0);
      const attackerChampion = lineageTestChampion("Parcenet opponent", 0);
      const top = wind ? catoMeadowsChanneler : woodlandSquirrels;
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [parcenetRoyalMaid, giantTortoise],
            "main-deck": [top, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: attackerChampion,
          zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const protectedAlly = player.card(giantTortoise);
      opponent.pass();
      player.activateAbility(parcenetRoyalMaid, "xxoo7dl5j4-a2", {
        targets: { "target-ally": [protectedAlly.objectId] },
      });
      passEffectsStack(game);
      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 1");
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: glimpse.cardIds,
        bottom: [],
      } satisfies GrandArchiveGlimpseAnswer);
      passEffectsStack(game);
      const before = game.state;
      if (wind) {
        expect(() => opponent.declareAttack(woodlandSquirrels, protectedAlly)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        opponent.declareAttack(woodlandSquirrels, protectedAlly);
        expect(game.state.combat?.targetIds).toEqual([protectedAlly.objectId]);
      }
    });
  }
});
