import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { powerforgedBurst } from "./powerforged-burst.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers OWnWJNstCO-a1 @covers OWnWJNstCO-a2 */
describe("Powerforged Burst — bounded sacrifice and repeated damage", () => {
  for (const x of [0, 1, 2, 3])
    for (const ally of [false, true])
      it(`sacrifices ${x} Powercells then deals ${x} separate hits, ally=${ally}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(powerforgedBurst, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [powerforgedBurst, woodlandSquirrels],
              field: [powercell, powercell, powercell, powercell, trainingSword, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [powercell, giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(powerforgedBurst),
          cells = p.cards(powercell),
          top = p.zone("main-deck")[0]!;
        const target = ally ? q.card(giantTortoise) : q.card(champion),
          targets = { "target-1": [target.objectId] };
        const before = game.state;
        for (const invalidX of [-1, 0.5, 4]) {
          expect(() =>
            p.activate(source, {
              targets,
              variables: { X: invalidX },
              costSelections: [cells.map((c) => c.objectId)],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        for (const invalid of [
          cells.slice(0, x === 0 ? 1 : x - 1).map((c) => c.objectId),
          [
            ...cells.slice(0, Math.max(0, x - 1)).map((c) => c.objectId),
            q.card(powercell).objectId,
          ],
          [
            ...cells.slice(0, Math.max(0, x - 1)).map((c) => c.objectId),
            p.card(trainingSword).objectId,
          ],
          [
            ...cells.slice(0, Math.max(0, x - 1)).map((c) => c.objectId),
            p.card(woodlandSquirrels, { zone: "field" }).objectId,
          ],
          Array.from({ length: Math.max(2, x) }, () => cells[0]!.objectId),
        ]) {
          expect(() =>
            p.activate(source, { targets, variables: { X: x }, costSelections: [invalid] }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const history = game.state.eventHistory.length;
        p.activate(source, {
          targets,
          variables: { X: x },
          costSelections: [cells.slice(0, x).map((c) => c.objectId)],
        });
        for (const c of cells.slice(0, x))
          expect(game.state.objects[c.objectId]?.zone).not.toBe("field");
        for (const c of cells.slice(x)) expect(game.state.objects[c.objectId]!.zone).toBe("field");
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        const hits = game.state.eventHistory
          .slice(history)
          .filter((e) => e.type === "damage-marked");
        expect(hits).toHaveLength(x);
        for (const hit of hits) expect(hit.amount).toBe(2);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          ally && x === 3 ? "graveyard" : "field",
        );
        expect(game.state.objects[target.objectId]!.damage).toBe(ally && x === 3 ? 0 : 2 * x);
        expect(p.zone("memory")).toEqual(x === 3 ? [top] : []);
        expect(p.zone("main-deck")).toHaveLength(x === 3 ? 1 : 2);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      });
});
