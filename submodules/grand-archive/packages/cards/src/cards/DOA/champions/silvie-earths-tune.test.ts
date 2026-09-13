import { describe } from "vitest";
import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { silvieEarthsTune } from "./silvie-earths-tune.ts";

/** @covers ZR8tnLruR6-a1 */
describe("Silvie, Earth's Tune \u2014 ZR8tnLruR6-a1", () => {
  proveChampionLineage({ card: silvieEarthsTune, lineageName: "Silvie", level: 3, memoryCost: 3 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { gaiasSongbird } from "../allies/gaias-songbird.ts";
import { vertusGaiasRoar } from "../allies/vertus-gaias-roar.ts";
import { invokeDominance } from "../actions/invoke-dominance.ts";
/** @covers ZR8tnLruR6-a2 */
describe("Silvie Earth's Tune reveals until a Tera Animal or Beast ally on real level-up", () => {
  for (const matchKind of ["animal", "beast", "missing"] as const)
    it(`match=${matchKind}`, () => {
      const starter = lineageTestChampion("Silvie", 0),
        matchCard = matchKind === "animal" ? gaiasSongbird : vertusGaiasRoar,
        game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Silvie", 1), lineageTestChampion("Silvie", 2)],
            zones: {
              memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "material-deck": [silvieEarthsTune],
              "main-deck": [
                grayWolf,
                invokeDominance,
                woodlandSquirrels,
                ...(matchKind === "missing" ? [] : [matchCard]),
                blitzMage,
              ],
            },
          },
          playerTwo: { champion: starter, zones: { "main-deck": [matchCard] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        match =
          matchKind === "missing"
            ? undefined
            : deck.find((c) => c.definitionId === matchCard.canonicalId),
        index = match ? deck.findIndex((c) => c.objectId === match.objectId) : deck.length;
      p.materialize(silvieEarthsTune);
      expect(p.zone("memory")).toHaveLength(0);
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(p.zone("hand")).toEqual(match ? [match] : []);
      const reveals = game.state.eventHistory
        .filter((e) => e.type === "card-revealed")
        .map((e) => e.objectId);
      expect(reveals).toEqual(deck.slice(0, index + (match ? 1 : 0)).map((c) => c.objectId));
      const untouched = match ? deck.slice(index + 1) : [];
      expect(p.zone("main-deck").slice(0, untouched.length)).toEqual(untouched);
      expect(
        p
          .zone("main-deck")
          .slice(untouched.length)
          .map((c) => c.objectId)
          .sort(),
      ).toEqual(
        deck
          .slice(0, index)
          .map((c) => c.objectId)
          .sort(),
      );
      expect(q.zone("main-deck")).toHaveLength(1);
      expect(q.zone("hand")).toHaveLength(0);
    });
});
