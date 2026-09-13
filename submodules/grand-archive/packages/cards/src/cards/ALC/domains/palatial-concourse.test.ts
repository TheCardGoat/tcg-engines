import { describe, expect, it } from "vitest";
import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { palatialConcourse } from "./palatial-concourse.ts";

/** @covers c7wklzjmwu-a1 */
describe("Palatial Concourse — beginning-of-recollection Glimpse 1", () => {
  for (const placement of ["top", "bottom"] as const) {
    it(`triggers only for its controller and returns the card to the ${placement}`, () => {
      const champion = createClassBonusTestChampion(
        palatialConcourse,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [palatialConcourse],
            "main-deck": [woodlandSquirrels, giantTortoise, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": [woodlandSquirrels, giantTortoise] },
        },
      });
      const player = game.player("player-one");

      advanceToRecollection(game, "player-two");
      expect(game.state.stack).toHaveLength(0);
      advanceToRecollection(game, "player-one");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "c7wklzjmwu-a1",
        ),
      ).toBe(true);

      const deck = player.zone("main-deck");
      const lookedAt = deck[0]!;
      passEffectsStack(game);
      const decision = game.state.decision;
      if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 1 decision");
      expect(decision.playerId).toBe(player.id);
      expect(decision.cardIds).toEqual([lookedAt.objectId]);
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: placement === "top" ? [lookedAt.objectId] : [],
        bottom: placement === "bottom" ? [lookedAt.objectId] : [],
      } satisfies GrandArchiveGlimpseAnswer);
      expect(player.zone("main-deck")).toEqual(
        placement === "top" ? deck : [...deck.slice(1), lookedAt],
      );
    });
  }
});
