import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { silvieWithThePack } from "./silvie-with-the-pack.ts";

/** @covers nllCALIXDT-a1 */
describe("Silvie, With the Pack \u2014 nllCALIXDT-a1", () => {
  proveChampionLineage({ card: silvieWithThePack, lineageName: "Silvie", level: 2, memoryCost: 2 });
});

/** @covers nllCALIXDT-a2 */
describe("Silvie's independent Animal and Beast entry draws", () => {
  for (const animals of [0, 1, 2])
    for (const beasts of [0, 1, 2])
      it(`draws for ${animals} Animals and ${beasts} Beasts`, () => {
        const starter = lineageTestChampion("Silvie", 0),
          previous = lineageTestChampion("Silvie", 1);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            lineage: [previous],
            zones: {
              "material-deck": [silvieWithThePack],
              memory: [woodlandSquirrels, woodlandSquirrels],
              field: [
                ...Array.from({ length: animals }, () => woodlandSquirrels),
                ...Array.from({ length: beasts }, () => grayWolf),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: starter, zones: { field: [woodlandSquirrels, grayWolf] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        p.materialize(silvieWithThePack);
        expect(p.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(Number(animals > 0) + Number(beasts > 0));
        expect(q.zone("hand")).toHaveLength(0);
      });
});
