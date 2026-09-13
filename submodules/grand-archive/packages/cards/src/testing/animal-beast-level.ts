import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { createClassBonusTestChampion, requireSingleFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveAnimalBeastLevel(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  for (const ally of [woodlandSquirrels, grayWolf]) {
    it(`gains one level only while a controlled ${ally.slug} is on the field`, () => {
      const base = createClassBonusTestChampion(card, false, "activation-discount");
      const face = requireSingleFace(base);
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: { ...face, elements: [...face.elements, "WIND" as const] },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: [ally, reclaim, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels, grayWolf] } },
      });
      const p = game.player("player-one");
      const target = p.card(champion);
      const level = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "level", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(level()).toBe(0);
      const cost = ally === grayWolf ? 2 : 0;
      const toPlay = p.cards(ally, { zone: "hand" })[0]!;
      p.activate(toPlay, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .filter((c) => c.objectId !== toPlay.objectId)
          .slice(0, cost)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      expect(level()).toBe(0);
      passEffectsStack(game);
      expect(level()).toBe(1);
      p.activate(reclaim, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
        targets: { "target-1": [toPlay.objectId] },
      });
      passEffectsStack(game);
      expect(level()).toBe(0);
      expect(p.cards(ally, { zone: "field" })).toHaveLength(0);
    });
  }
}
