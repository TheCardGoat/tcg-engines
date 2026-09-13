import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { artificersOpus } from "../../DOA/allies/artificers-opus.ts";
import { claudeFatedVisionary } from "../allies/claude-fated-visionary.ts";
import { astraSight } from "./astra-sight.ts";
import { cometfall } from "./cometfall.ts";

/** @covers 4d5vettczb-a1 @covers 4d5vettczb-a2 */
describe("Cometfall — Starcalling and non-Astra damage", () => {
  for (const classBonus of [false, true]) {
    it(`starcalls for two and deals ${classBonus ? 4 : 3} with Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(cometfall, classBonus, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [astraSight, woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels, artificersOpus],
            "main-deck": [cometfall, cometfall, cometfall],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [woodlandSquirrels, artificersOpus, claudeFatedVisionary] },
        },
      });
      const player = game.player("player-one");
      const opposing = game.player("player-two");
      const ownNonAstra = player.card(artificersOpus);
      const opposingNonAstra = opposing.card(artificersOpus);
      const astraUnit = opposing.card(claudeFatedVisionary);
      player.activate(astraSight);
      passEffectsStack(game);
      const decision = game.state.decision;
      if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse decision");
      const starcalledId = decision.cardIds[0]!;
      answerDecision(game, "resolve-glimpse", {
        kind: "starcall",
        cardId: starcalledId,
        bottom: [],
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      expect(game.state.objects[starcalledId]!.activationStates.has("starcalled")).toBe(true);
      passEffectsStack(game);

      expect(game.state.objects[ownNonAstra.objectId]!.damage).toBe(classBonus ? 4 : 3);
      expect(game.state.objects[opposingNonAstra.objectId]!.damage).toBe(classBonus ? 4 : 3);
      expect(game.state.objects[astraUnit.objectId]!.damage).toBe(0);
      expect(player.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      expect(opposing.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
    });
  }
});
