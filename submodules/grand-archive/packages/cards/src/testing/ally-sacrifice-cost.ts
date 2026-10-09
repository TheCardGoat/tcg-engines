import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { automatonDrone } from "../cards/ALC/tokens/automaton-drone.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";

export function proveAllySacrificeCost(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  cost: number,
  targetsGraveyard = false,
) {
  describe("one ally paid before resolution", () => {
    for (const matching of [false, true])
      for (const donor of [giantTortoise, automatonDrone]) {
        it(`requires exactly one controlled field ally, class=${matching}, donor=${donor.slug}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  giantTortoise,
                  ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
                ],
                field: [donor, donor, trainingSword],
                graveyard: [giantTortoise, reclaim],
              },
            },
            playerTwo: { champion, zones: { field: [donor] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const donors = p.cards(donor, { zone: "field" });
          const pay = p
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const options = {
            reservePayment: pay.slice(0, cost),
            ...(targetsGraveyard ? { targets: { "target-card": [p.card(reclaim).objectId] } } : {}),
          };
          const before = game.state;
          for (const ids of [
            [],
            donors.map((c) => c.objectId),
            [donors[0]!.objectId, donors[0]!.objectId],
            [q.card(donor).objectId],
            [p.card(giantTortoise, { zone: "hand" }).objectId],
            [p.card(giantTortoise, { zone: "graveyard" }).objectId],
            [p.card(trainingSword).objectId],
            [p.card(champion).objectId],
          ]) {
            expect(() => p.activate(card, { ...options, costSelections: [ids] })).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activate(card, {
              ...options,
              reservePayment: cost ? pay.slice(0, cost - 1) : pay,
              costSelections: [[donors[0]!.objectId]],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(card, { ...options, costSelections: [[donors[0]!.objectId]] });
          expect(game.state.objects[donors[0]!.objectId]?.zone).not.toBe("field");
          expect(game.state.objects[donors[1]!.objectId]!.zone).toBe("field");
          expect(game.state.objects[q.card(donor).objectId]!.zone).toBe("field");
          expect(p.zone("memory")).toHaveLength(cost);
          expect(p.card(card, { zone: "effects-stack" })).toBeDefined();
          expect(p.card(reclaim, { zone: "graveyard" })).toBeDefined();
        });
      }
  });
}
