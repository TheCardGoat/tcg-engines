import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { imperialAssassin } from "../../AMB/allies/imperial-assassin.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { gawainChivalrousThief } from "./gawain-chivalrous-thief.ts";

/** @covers du50pcescf-a1 */
describe("Gawain, Chivalrous Thief — Level 2+ True Sight", () => {
  for (const level of [1, 2]) {
    it(`${level >= 2 ? "permits" : "rejects"} attacks against Stealth at level ${level}`, () => {
      const champion = lineageTestChampion("Gawain", 0);
      const opponentChampion = createClassBonusTestChampion(
        imperialAssassin,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage: Array.from({ length: level }, (_, index) =>
            lineageTestChampion("Gawain", index + 1),
          ),
          zones: { field: [gawainChivalrousThief] },
        },
        playerTwo: { champion: opponentChampion, zones: { field: [imperialAssassin] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const before = game.state;
      if (level < 2) {
        expect(() => player.declareAttack(gawainChivalrousThief, imperialAssassin)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        player.declareAttack(gawainChivalrousThief, imperialAssassin);
        expect(game.state.combat?.targetIds).toEqual([opponent.card(imperialAssassin).objectId]);
      }
    });
  }
});

/** @covers du50pcescf-a2 */
describe("Gawain, Chivalrous Thief — Champion Hit memory theft", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "sacrifices and discards" : "declines and preserves both zones"}`, () => {
      const champion = createClassBonusTestChampion(
        gawainChivalrousThief,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [gawainChivalrousThief] } },
        playerTwo: { champion, zones: { memory: [giantTortoise, woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const source = player.card(gawainChivalrousThief);
      const discarded = opponent.card(giantTortoise, { zone: "memory" });
      const memoryIds = opponent.zone("memory").map((card) => card.objectId);
      player.declareAttack(source, opponent.card(champion));
      advanceCombatToTrigger(game, "du50pcescf-a2");
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-optional-effect");
      answerDecision(game, "resolve-optional-effect", accept);
      passEffectsStack(game);
      if (accept) {
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(
          game.state.eventHistory
            .filter((event) => event.type === "cards-looked-at")
            .flatMap((event) => (event.type === "cards-looked-at" ? event.objectIds : [])),
        ).toEqual(memoryIds);
        answerDecision(game, "resolve-effect-choice", [discarded.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[discarded.objectId]!.zone).toBe("graveyard");
        expect(opponent.zone("memory")).toHaveLength(1);
      } else {
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(opponent.zone("memory").map((card) => card.objectId)).toEqual(memoryIds);
      }
    });
  }
});
