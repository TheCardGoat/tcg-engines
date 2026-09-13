import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { reposition } from "../cards/ALC/actions/reposition.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

export function proveCyclingHerb({
  card,
  abilityId,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly abilityId: string;
}): void {
  for (const hasHandCard of [true, false]) {
    it(`draws only after putting a card on the bottom (hand present=${hasHandCard})`, () => {
      const champion = createClassBonusTestChampion(card, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: hasHandCard ? [woodlandSquirrels] : [],
            "main-deck": [reposition],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      const hand = player.zone("hand");
      player.activateAbility(card, abilityId);
      expect(player.cards(card, { zone: "field" })).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual(deck);
      expect(player.zone("hand")).toEqual(hand);
      expect(game.resolveStackUntilChoice()).toBe("stack-empty");
      expect(player.zone("hand")).toEqual(hasHandCard ? deck : []);
      expect(player.zone("main-deck")).toEqual(hasHandCard ? hand : deck);
      expect(player.zone("graveyard")).toHaveLength(0);
    });
  }
}
