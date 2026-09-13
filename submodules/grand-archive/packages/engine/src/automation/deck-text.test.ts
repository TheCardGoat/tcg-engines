import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import {
  parseGrandArchiveDeckTextLine,
  resolveGrandArchiveCardIdentifier,
  resolveGrandArchiveTextDeck,
} from "./deck-text.ts";

function card(
  canonicalId: string,
  slug: string,
  name: string,
  type: GrandArchivePlayableCardType,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name,
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["SPIRIT"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("champion-id", "text-champion", "Text Champion", "CHAMPION");
const action = card("action-id", "text-action", "Text Action", "ACTION");
const duplicateA = card("duplicate-a", "duplicate-a", "Nameless Champion", "CHAMPION");
const duplicateB = card("duplicate-b", "duplicate-b", "Nameless Champion", "CHAMPION");
const program = createGrandArchiveMatchProgram([champion, action, duplicateA, duplicateB]);

describe("Grand Archive text deck resolution", () => {
  it("parses positive counts and ignores blank lines and comments", () => {
    expect(parseGrandArchiveDeckTextLine("4x Text Action")).toEqual({
      count: 4,
      identifier: "Text Action",
    });
    expect(parseGrandArchiveDeckTextLine(" # sideboard note")).toBeNull();
    expect(parseGrandArchiveDeckTextLine("  ")).toBeNull();
    expect(() => parseGrandArchiveDeckTextLine("Text Action")).toThrow("Invalid");
    expect(() => parseGrandArchiveDeckTextLine("0x Text Action")).toThrow("Invalid");
  });

  it("resolves exact canonical ids, slugs, and unambiguous printed names", () => {
    expect(resolveGrandArchiveCardIdentifier(program, action.canonicalId)).toBe(
      program.cardsById[action.canonicalId],
    );
    expect(resolveGrandArchiveCardIdentifier(program, action.slug).canonicalId).toBe(
      action.canonicalId,
    );
    expect(resolveGrandArchiveCardIdentifier(program, "Text Action").canonicalId).toBe(
      action.canonicalId,
    );
  });

  it("fails closed for unknown and ambiguous identifiers", () => {
    expect(() => resolveGrandArchiveCardIdentifier(program, "Missing")).toThrow(
      "catalog has no card",
    );
    expect(() => resolveGrandArchiveCardIdentifier(program, "Nameless Champion")).toThrow(
      "ambiguous",
    );
  });

  it("aggregates repeated lines while preserving separate main and material decks", () => {
    expect(
      resolveGrandArchiveTextDeck(program, {
        mainDeck: "2x Text Action\n# repeated printing\n3x action-id",
        materialDeck: "1x text-champion",
        startingChampion: "Text Champion",
      }),
    ).toEqual({
      mainDeck: [{ definitionId: action.canonicalId, count: 5 }],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
  });
});
