import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { coneOfFrost } from "../cards/P24/actions/cone-of-frost.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveConeOfFrostLevels() {
  for (const matching of [false, true])
    for (const level of [0, 1, 2, 3, 4, 5, 6])
      for (const mode of ["none", "same", "split"]) {
        it(`resolves independent frost clauses at level ${level}, class ${matching}, targets ${mode}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(coneOfFrost, matching, "activation-discount"),
            level,
          );
          const opponent = lineageTestChampion("Opponent", 0);
          const cost = matching ? 2 : 3;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [coneOfFrost, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                field: [giantTortoise],
              },
            },
            playerTwo: { champion: opponent, zones: { field: [giantTortoise, trainingSword] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const own = p.card(giantTortoise),
            other = q.card(giantTortoise),
            foe = q.card(opponent);
          const targets: Record<string, GrandArchiveTargetId[]> = {};
          const clauses = [
            [1, "target-1"],
            [3, "i7sbjy86ep-a3:target-1"],
            [5, "i7sbjy86ep-a4:target-1"],
          ] as const;
          let count = 0;
          for (const [threshold, key] of clauses)
            if (level >= threshold) {
              targets[key] =
                mode === "none"
                  ? []
                  : [mode === "same" ? foe.objectId : [own, other, foe][count]!.objectId];
              count++;
            }
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (count) {
            const before = game.state;
            expect(() =>
              p.activate(coneOfFrost, {
                reservePayment,
                targets: { ...targets, "target-1": [q.card(trainingSword).objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            expect(() =>
              p.activate(coneOfFrost, {
                reservePayment,
                targets: { ...targets, "target-1": [foe.objectId, other.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          if (mode === "same" && count > 1) {
            const before = game.state;
            expect(() => p.activate(coneOfFrost, { reservePayment, targets })).toThrow(
              "A target identity cannot be selected twice",
            );
            expect(game.state).toEqual(before);
            return;
          }
          p.activate(coneOfFrost, { reservePayment, ...(count ? { targets } : {}) });
          expect(game.state.objects[foe.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(
            mode === "same" ? 2 * count : mode === "split" && count === 3 ? 2 : 0,
          );
          expect(game.state.objects[own.objectId]!.damage).toBe(
            mode === "split" && count >= 1 ? 2 : 0,
          );
          expect(game.state.objects[other.objectId]!.damage).toBe(
            mode === "split" && count >= 2 ? 2 : 0,
          );
          expect(p.cards(coneOfFrost, { zone: "graveyard" })).toHaveLength(1);
        });
      }
}
