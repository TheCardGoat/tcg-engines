import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveConditionalPetLevel(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  for (const allies of [[], [giantTortoise], [grayWolf], [giantTortoise, grayWolf], [blitzMage]])
    it(`own field allies: ${allies.map((c) => c.slug).join(", ") || "none"}`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: allies,
              graveyard: [giantTortoise],
              hand: [card, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [grayWolf, giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        level = (player: typeof p) =>
          deriveGrandArchiveNumericProperty(
            game.state.objects[player.card(champion).objectId]!,
            "level",
            { program: game.program, state: game.state, controllerId: player.id, bindings: {} },
          );
      p.activate(card, {
        reservePayment: [
          { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      expect(level(p)).toBe(allies.includes(giantTortoise) || allies.includes(grayWolf) ? 1 : 0);
      expect(level(q)).toBe(0);
      advanceToMain(game, q.id);
      expect(level(p)).toBe(0);
    });
}
