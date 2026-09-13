import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grandArchiveDefaultFaceId } from "./class-bonus-test-champion.ts";

/** Blank fixture champions isolate the named Lineage restriction from other champion abilities. */
export function lineageTestChampion(
  lineageName: string,
  level: number,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const canonicalId = `lineage-test-${lineageName.toLowerCase().replaceAll(" ", "-")}-${level}`;
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        name: `${lineageName}, Test Level ${level}`,
        lineageName,
        cost: { kind: "memory", amount: level },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: ["SPIRIT"],
          subtypes: ["SPIRIT"],
        },
        elements: ["NORM"],
        stats: { level, life: 20 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

export function proveChampionLineage({
  card,
  lineageName,
  level,
  memoryCost,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly lineageName: string;
  readonly level: number;
  readonly memoryCost: number;
}): void {
  function setup(previousName: string, previousLevel = level - 1) {
    const starter = lineageTestChampion(lineageName, 0);
    const lineage = Array.from({ length: previousLevel }, (_, index) =>
      lineageTestChampion(index + 1 === previousLevel ? previousName : lineageName, index + 1),
    );
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage,
        zones: {
          "material-deck": [card],
          memory: Array.from({ length: memoryCost }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    return { game, starter };
  }

  it(`levels from the previous-level ${lineageName} only when materialization resolves`, () => {
    const { game, starter } = setup(lineageName);
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    const previous = game.state.objects[champion.objectId]?.activeDefinitionId;
    player.materialize(card);
    expect(player.zone("memory")).toHaveLength(0);
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(previous);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(card.canonicalId);
    expect(player.zone("field")).toHaveLength(1);
    expect(player.cards(card, { zone: "material-deck" })).toHaveLength(0);
  });

  it("rejects a different current champion even when the required name exists deeper in the lineage", () => {
    const { game } = setup("Unrelated");
    const before = game.state;
    expect(() => game.player("player-one").materialize(card)).toThrow("Lineage restriction");
    expect(game.state).toEqual(before);
  });

  it("does not allow skipping a champion level even with the correct name", () => {
    const { game } = setup(lineageName, level - 2);
    const before = game.state;
    expect(() => game.player("player-one").materialize(card)).toThrow();
    expect(game.state).toEqual(before);
  });
}

/** Proves a source champion's printed “can only level up into” destination restriction. */
export function proveChampionSuccessorRestriction({
  card,
  lineageName,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly lineageName: string;
}): void {
  const face = card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
  const level = face.stats.level;
  if (typeof level !== "number" || !face.typeLine.types.includes("CHAMPION")) {
    throw new Error(`${face.name} must be a champion with a numeric level`);
  }
  const championLevel = level;

  function setup(destinationName: string) {
    const starter = lineageTestChampion(lineageName, 0);
    const successor = lineageTestChampion(destinationName, championLevel + 1);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [
          ...Array.from({ length: Math.max(0, championLevel - 1) }, (_, index) =>
            lineageTestChampion(lineageName, index + 1),
          ),
          card,
        ],
        zones: {
          "material-deck": [successor],
          memory: Array.from({ length: championLevel + 1 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    return { game, starter, successor };
  }

  it(`allows leveling into the next ${lineageName} champion`, () => {
    const { game, starter, successor } = setup(lineageName);
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    player.materialize(successor);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(successor.canonicalId);
  });

  it("rejects leveling into a differently named successor", () => {
    const { game, successor } = setup("Unrelated");
    const before = game.state;
    expect(() => game.player("player-one").materialize(successor)).toThrow(
      "does not satisfy an active requirement",
    );
    expect(game.state).toEqual(before);
  });
}
