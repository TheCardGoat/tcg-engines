import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { requireSingleFace } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { shroudInMist } from "../actions/shroud-in-mist.ts";
import { cramSession } from "../actions/cram-session.ts";
import { reclaim } from "../actions/reclaim.ts";
import { describe, expect, it } from "vitest";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { raiArchmage } from "./rai-archmage.ts";

/** @covers zdIhSL5RhK-a1 */
describe("Rai, Archmage \u2014 zdIhSL5RhK-a1", () => {
  proveChampionLineage({ card: raiArchmage, lineageName: "Rai", level: 2, memoryCost: 2 });
});

/** @covers zdIhSL5RhK-a2 */
describe("Rai Archmage's inherited first-Mage-action trigger", () => {
  for (const position of ["active", "inherited", "material-deck"] as const)
    it(`works from the active or inner lineage and resets each turn (${position})`, () => {
      const present = position !== "material-deck";
      const base = lineageTestChampion("Rai", 0);
      const starter = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: { ...requireSingleFace(base), elements: ["NORM", "WATER", "WIND"] as const },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: [
            lineageTestChampion("Rai", 1),
            ...(present ? [raiArchmage] : [lineageTestChampion("Rai", 2)]),
            ...(position === "inherited" ? [lineageTestChampion("Rai", 3)] : []),
          ],
          zones: {
            "material-deck": present ? [] : [raiArchmage],
            field: [woodlandSquirrels],
            hand: [
              shroudInMist,
              cramSession,
              cramSession,
              reclaim,
              ...Array.from({ length: 15 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        id = p.card(starter).objectId;
      const count = () => game.state.objects[id]!.counters.enlighten ?? 0;
      function play(
        card: Parameters<typeof p.activate>[0],
        cost: number,
        targets?: Parameters<typeof p.activate>[1],
      ) {
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          ...targets,
        });
        passEffectsStack(game);
      }
      play(shroudInMist, 5);
      expect(count()).toBe(0);
      play(p.cards(cramSession, { zone: "hand" })[0]!, 1);
      expect(count()).toBe(present ? 1 : 0);
      play(p.cards(cramSession, { zone: "hand" })[0]!, 1);
      expect(count()).toBe(present ? 1 : 0);
      advanceToMain(game, q.id);
      q.pass();
      play(reclaim, 2, {
        targets: { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] },
      });
      expect(count()).toBe(present ? 2 : 0);
      expect(game.state.objects[q.card(starter).objectId]!.counters.enlighten ?? 0).toBe(0);
    });
});
