import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { subjugatingLash } from "./subjugating-lash.ts";

/** @covers bcizm6h38l-a1 */
describe("Subjugating Lash — twelve-damage power threshold", () => {
  for (const damaged of [false, true]) {
    it(`deals ${damaged ? 4 : 2} combat damage with champion damage ${damaged ? 12 : 0}`, () => {
      const baseChampion = createClassBonusTestChampion(
        subjugatingLash,
        false,
        "activation-discount",
      );
      if (baseChampion.layout.kind !== "single-faced")
        throw new Error("Expected single-faced fixture champion");
      const champion = {
        ...baseChampion,
        layout: {
          kind: "single-faced" as const,
          face: { ...baseChampion.layout.face, elements: ["NORM", "UMBRA"] as const },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              subjugatingLash,
              woodlandSquirrels,
              woodlandSquirrels,
              ...(damaged ? [umbraSight, umbraSight, umbraSight] : []),
            ],
            "main-deck": Array.from({ length: 9 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const ownChampion = player.card(champion, { zone: "field" });
      const opponentChampion = game.player("player-two").card(champion, { zone: "field" });
      for (let index = 0; index < (damaged ? 3 : 0); index++) {
        player.activate(player.cards(umbraSight, { zone: "hand" })[0]!);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
      }
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damaged ? 12 : 0);

      player.activate(subjugatingLash, {
        attackAttackerId: ownChampion.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      expect(game.resolveStackUntilChoice()).toBe("decision");
      const attack = player.card(subjugatingLash, { zone: "intent" });
      player.executeLegal(
        (candidate) =>
          candidate.command.move === "answer-decision" &&
          typeof candidate.command.answer === "object" &&
          candidate.command.answer !== null &&
          "attackerId" in candidate.command.answer &&
          candidate.command.answer.attackerId === ownChampion.objectId &&
          !("delegatePlayerId" in candidate.command.answer) &&
          "targetIds" in candidate.command.answer &&
          Array.isArray(candidate.command.answer.targetIds) &&
          candidate.command.answer.targetIds.includes(opponentChampion.objectId),
        "declare Subjugating Lash against the opposing champion",
      );
      expect(game.state.combat?.intentIds).toContain(attack.objectId);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(damaged ? 4 : 2);
    });
  }
});
