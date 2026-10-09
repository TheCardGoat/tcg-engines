import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { otherworldlyPossessions } from "./otherworldly-possessions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers MuCOJRgMdj-a1 */
describe("Otherworldly Possessions distinct reserve costs", () => {
  for (const mode of ["empty", "memory-only", "duplicates", "mixed"]) {
    it(`counts actual reserve costs from own field and graveyard: ${mode}`, () => {
      const champion = lineageTestChampion("Own", 0),
        opponent = lineageTestChampion("Other", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              otherworldlyPossessions,
              otherworldlyPossessions,
              ...Array.from({ length: 10 }, () => woodlandSquirrels),
            ],
            field:
              mode === "empty"
                ? []
                : mode === "memory-only"
                  ? [trainingSword]
                  : [woodlandSquirrels, woodlandSquirrels, giantTortoise, trainingSword],
            graveyard:
              mode === "mixed"
                ? [sparkAlight, sparkAlight, giantTortoise, woodlandSquirrels, trainingSword]
                : mode === "duplicates"
                  ? [woodlandSquirrels, giantTortoise]
                  : [],
            banishment: [sparkAlight],
            "main-deck": [sparkAlight],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: { field: [giantTortoise], graveyard: [sparkAlight] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      const base = mode === "mixed" ? 3 : mode === "duplicates" ? 2 : 0;
      let total = 0;
      for (let cast = 0; cast < 2; cast++) {
        p.activate(p.cards(otherworldlyPossessions, { zone: "hand" })[0]!, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 5)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(total);
        passEffectsStack(game);
        total += base + cast;
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(total);
        expect(game.state.objects[q.card(opponent).objectId]!.counters.enlighten ?? 0).toBe(0);
      }
    });
  }
});
