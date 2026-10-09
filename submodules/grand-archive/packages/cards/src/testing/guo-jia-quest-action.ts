import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { idleFatestone } from "../cards/HVN/items/idle-fatestone.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveGuoJiaQuestAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  cost: number,
  mode: "draw" | "damage" | "sacrifice",
) {
  for (const matching of [false, true]) {
    it(`adds quest counters only to the matching controller's champion: ${matching}`, () => {
      const champion = enableAllTestElements(
        lineageTestChampion(matching ? "Guo Jia" : "Other", 0),
      );
      const opponent = lineageTestChampion(matching ? "Other" : "Guo Jia", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, card, ...Array.from({ length: cost * 2 }, () => woodlandSquirrels)],
            field: mode === "sacrifice" ? [idleFatestone, idleFatestone] : [],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion: opponent },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(opponent);
      for (let cast = 1; cast <= 2; cast++) {
        p.activate(p.cards(card, { zone: "hand" })[0]!, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          ...(mode === "damage" ? { targets: { "target-1": [foe.objectId] } } : {}),
          ...(mode === "sacrifice"
            ? { costSelections: [[p.cards(idleFatestone, { zone: "field" })[0]!.objectId]] }
            : {}),
        });
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(
          matching ? cast - 1 : 0,
        );
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(
          matching ? cast : 0,
        );
        expect(game.state.objects[foe.objectId]!.counters["named:quest"] ?? 0).toBe(0);
      }
    });
  }
}
