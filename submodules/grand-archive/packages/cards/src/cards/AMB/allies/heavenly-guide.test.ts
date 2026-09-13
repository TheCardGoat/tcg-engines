import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { heavenlyGuide } from "./heavenly-guide.ts";

/** @covers tkdky3sxao-a1 */
describe("Heavenly Guide — Level 2+ On Enter level up", () => {
  for (const level of [1, 2] as const) {
    it(`${level >= 2 ? "levels up" : "does not level up"} while the champion is level ${level}`, () => {
      const starter = lineageTestChampion("Guide", 0);
      const next = lineageTestChampion("Guide", level + 1);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: Array.from({ length: level }, (_, index) =>
            lineageTestChampion("Guide", index + 1),
          ),
          zones: {
            hand: [heavenlyGuide, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            "material-deck": [next],
            memory: Array.from({ length: 3 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: createClassBonusTestChampion(heavenlyGuide, true, "activation-discount"),
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const champion = player.card(starter, { zone: "field" });
      const beforeDefinition = game.state.objects[champion.objectId]!.activeDefinitionId;
      player.activate(heavenlyGuide, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "tkdky3sxao-a1",
        ),
      ).toBe(level >= 2);
      expect(game.state.objects[champion.objectId]!.activeDefinitionId).toBe(beforeDefinition);
      passEffectsStack(game);
      if (level >= 2 && game.state.decision?.kind === "resolve-effect-choice") {
        answerDecision(game, "resolve-effect-choice", [
          player.card(next, { zone: "material-deck" }).objectId,
        ]);
        passEffectsStack(game);
      }
      expect(game.state.objects[champion.objectId]!.activeDefinitionId).toBe(
        level >= 2 ? next.canonicalId : beforeDefinition,
      );
    });
  }
});
