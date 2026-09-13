import { describe, expect, it } from "vitest";
import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { reposition } from "../actions/reposition.ts";
import { harvestHerbs } from "../actions/harvest-herbs.ts";
import { potionOfHealing } from "./potion-of-healing.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { serumOfWisdom } from "./serum-of-wisdom.ts";

/** @covers bae3z4pyx8-a1 */
describe("serum-of-wisdom — Brew", () => {
  proveBrewPotion({
    card: serumOfWisdom,
    reserveCost: 3,
    ingredients: [fraysia, manaroot, blightroot],
    wrongIngredients: [fraysia, manaroot, woodlandSquirrels],
  });
});

/** @covers bae3z4pyx8-a2 */
describe("Serum of Wisdom — Glimpse then draw into memory", () => {
  for (const deckSize of [2, 4]) {
    it(`reorders up to three cards before drawing with ${deckSize} cards in the deck`, () => {
      const champion = createClassBonusTestChampion(serumOfWisdom, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [serumOfWisdom],
            "main-deck": [woodlandSquirrels, reposition, potionOfHealing, harvestHerbs].slice(
              0,
              deckSize,
            ),
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activateAbility(serumOfWisdom, "bae3z4pyx8-a2");
      expect(player.cards(serumOfWisdom, { zone: "field" })).toHaveLength(0);
      expect(player.zone("memory")).toHaveLength(0);
      passEffectsStack(game);
      const glimpse = game.state.decision;
      expect(glimpse?.kind).toBe("resolve-glimpse");
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse choice");
      const seen = deck.slice(0, 3);
      expect(glimpse.cardIds).toEqual(seen.map((ref) => ref.objectId));
      expect(player.zone("memory")).toHaveLength(0);
      const selectedTop = seen.at(-1)!;
      const bottom = seen.slice(0, -1).reverse();
      const answer = {
        kind: "reorder",
        top: [selectedTop.objectId],
        bottom: bottom.map((ref) => ref.objectId),
      } satisfies GrandArchiveGlimpseAnswer;
      answerDecision(game, "resolve-glimpse", answer);
      passEffectsStack(game);
      expect(player.zone("memory")).toEqual([selectedTop]);
      expect(player.zone("hand")).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual([...deck.slice(3), ...bottom]);
      expect(game.state.stack).toHaveLength(0);
    });
  }
});
