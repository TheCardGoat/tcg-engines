import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { dormantSacrificialAltar } from "./dormant-sacrificial-altar.ts";
import { exaltedDorumegianThrone } from "./exalted-dorumegian-throne.ts";

/** @covers p4lpnvx7mn-a1 */
describe("Exalted Dorumegian Throne — controlled ally bonus", () => {
  it("adds one power and life only to its controller's allies", () => {
    const champion = lineageTestChampion("Throne", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [exaltedDorumegianThrone, giantTortoise] } },
      playerTwo: { champion, zones: { field: [giantTortoise] } },
    });
    const stats = (playerId: "player-one" | "player-two") => {
      const player = game.player(playerId);
      const ally = player.card(giantTortoise, { zone: "field" });
      const evaluation = {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      };
      return [
        deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, "power", evaluation),
        deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, "life", evaluation),
      ];
    };
    expect(stats("player-one")).toEqual([2, 7]);
    expect(stats("player-two")).toEqual([1, 6]);
  });
});

/** @covers p4lpnvx7mn-a2 */
describe("Exalted Dorumegian Throne — Upkeep domain threshold", () => {
  for (const otherDomains of [4, 5]) {
    it(`${otherDomains <= 4 ? "sacrifices" : "remains"} with ${otherDomains} other domains`, () => {
      const champion = lineageTestChampion("Throne", 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [
              exaltedDorumegianThrone,
              ...Array.from({ length: otherDomains }, () => dormantSacrificialAltar),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const source = player.card(exaltedDorumegianThrone, { zone: "field" });
      advanceToRecollection(game, player.id);
      if (otherDomains <= 4) {
        expect(game.state.stack).toMatchObject([
          { kind: "triggered-ability", ability: { id: "p4lpnvx7mn-a2" } },
        ]);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      } else {
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      }
    });
  }
});
