import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import {
  lineageTestChampion,
  proveChampionSuccessorRestriction,
} from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { polkhawkBoisterousRiot } from "./polkhawk-boisterous-riot.ts";

/** @covers 8eyeqhc37y-a1 */
describe("Polkhawk, Boisterous Riot — Lineage", () => {
  proveChampionSuccessorRestriction({
    card: polkhawkBoisterousRiot,
    lineageName: "Polkhawk",
  });
});

function starter(withFire: boolean) {
  const champion = lineageTestChampion("Polkhawk", 0);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        elements: withFire ? (["NORM", "FIRE"] as const) : (["NORM"] as const),
      },
    },
  };
}

function blankAlly(name: string, ranger: boolean) {
  const canonicalId = `polkhawk-${name.toLowerCase().replaceAll(" ", "-")}`;
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced" as const,
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name,
        cost: { kind: "reserve" as const, amount: 1 },
        typeLine: {
          supertypes: [],
          types: ["ALLY"] as const,
          classes: [ranger ? "RANGER" : "SPIRIT"] as const,
          subtypes: [ranger ? "RANGER" : "SPIRIT"] as const,
        },
        elements: ["NORM"] as const,
        stats: { power: 1, life: 1 },
        rulesText: "",
        abilities: [],
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

const nonRanger = blankAlly("Polkhawk Non-Ranger", false);
const ranger = blankAlly("Polkhawk Ranger", true);

function advanceToMain(game: GrandArchiveTestEngine): void {
  for (let step = 0; step < 64; step++) {
    if (
      game.state.turn.playerId === game.player("player-one").id &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  throw new Error("Did not reach main phase");
}

/** @covers 8eyeqhc37y-a2 */
describe("Polkhawk, Boisterous Riot — conditional next Ranger entry", () => {
  for (const withFire of [false, true]) {
    it(`another fire lineage card=${withFire}`, () => {
      const startingChampion = starter(withFire);
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: startingChampion,
          zones: {
            "material-deck": [polkhawkBoisterousRiot],
            memory: [woodlandSquirrels],
            hand: [
              nonRanger,
              ranger,
              ranger,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
        definitions: [nonRanger, ranger],
      });
      const player = game.player("player-one");
      player.materialize(polkhawkBoisterousRiot);
      player.pass();
      game.player("player-two").pass();
      passEffectsStack(game);
      advanceToMain(game);

      const payments = player.cards(woodlandSquirrels, { zone: "hand" });
      player.activate(nonRanger, {
        reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
      });
      passEffectsStack(game);
      expect(
        game.state.objects[player.card(nonRanger, { zone: "field" }).objectId]!.states.has(
          "distant",
        ),
      ).toBe(false);

      const [firstRanger, secondRanger] = player.cards(ranger, { zone: "hand" });
      player.activate(firstRanger!, {
        reservePayment: [{ kind: "card", cardId: payments[1]!.objectId }],
      });
      passEffectsStack(game);
      expect(game.state.objects[firstRanger!.objectId]!.states.has("distant")).toBe(withFire);

      player.activate(secondRanger!, {
        reservePayment: [{ kind: "card", cardId: payments[2]!.objectId }],
      });
      passEffectsStack(game);
      expect(game.state.objects[secondRanger!.objectId]!.states.has("distant")).toBe(false);
    });
  }
});
