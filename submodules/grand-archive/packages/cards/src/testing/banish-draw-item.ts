import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion, requireSingleFace } from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveBanishDrawItem({
  card,
  abilityId,
  requiredOpponentElement,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  requiredOpponentElement?: GrandArchiveElement;
}): void {
  const elements: readonly GrandArchiveElement[] = requiredOpponentElement
    ? [requiredOpponentElement, "NORM"]
    : ["NORM"];
  for (const element of elements) {
    it(`checks the opponent's ${element} champion before banishing itself and drawing`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const base = lineageTestChampion("Opponent", 0);
      const opponent = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: { ...requireSingleFace(base), elements: [element] },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [card], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion: opponent, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one");
      const before = game.state;
      if (requiredOpponentElement && element !== requiredOpponentElement) {
        expect(() => p.activateAbility(card, abilityId)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      const deck = p.zone("main-deck");
      p.activateAbility(card, abilityId);
      expect(p.cards(card, { zone: "banishment" })).toHaveLength(1);
      expect(p.zone("hand")).toHaveLength(0);
      expect(() => p.activateAbility(card, abilityId)).toThrow();
      passEffectsStack(game);
      expect(p.zone("hand")).toEqual(deck.slice(0, 1));
      expect(p.zone("main-deck")).toEqual(deck.slice(1));
      expect(game.player("player-two").zone("hand")).toHaveLength(0);
    });
  }
}
