import { describe, expect, it } from "vite-plus/test";
import type { Card } from "@tcg/gundam-types";
import {
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
  classifyGundamTournamentArchetype,
} from "./archetype-classifier.ts";

function card(canonicalId: string, color: NonNullable<Card["color"]>, sourceTitle: string): Card {
  return {
    cardNumber: canonicalId,
    canonicalId,
    name: canonicalId,
    slug: canonicalId.toLowerCase(),
    type: "unit",
    color,
    sourceTitle,
    level: 1,
    cost: 1,
    ap: 1,
    hp: 1,
    battlefieldZones: ["space"],
    traits: [],
    keywordEffects: [],
    rarity: "common",
    effect: "",
    printings: [],
  };
}

const catalog = new Map<string, Card>([
  ["A-1", card("A-1", "blue", "Theme Alpha")],
  ["A-2", card("A-2", "blue", "Theme Alpha")],
  ["A-3", card("A-3", "red", "Theme Alpha")],
  ["A-4", card("A-4", "green", "Theme Alpha")],
  ["B-1", card("B-1", "blue", "Theme Beta")],
  ["B-2", card("B-2", "red", "Theme Beta")],
  ["B-3", card("B-3", "red", "Theme Beta")],
  ["C-1", card("C-1", "blue", "Theme Gamma")],
  ["C-2", card("C-2", "red", "Theme Gamma")],
  ["C-3", card("C-3", "red", "Theme Gamma")],
  ["D-1", card("D-1", "blue", "Theme Delta")],
  ["D-2", card("D-2", "red", "Theme Delta")],
  ["D-3", card("D-3", "red", "Theme Delta")],
]);

function deck(entries: Array<{ canonicalId: string; quantity: number }>) {
  return {
    game: "gundam",
    sections: [{ id: "main", entries }],
  };
}

describe("Gundam tournament archetype classifier", () => {
  it("classifies a dominant source title only after resolving exact deck colors", () => {
    const result = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 16 },
        { canonicalId: "A-2", quantity: 12 },
        { canonicalId: "A-3", quantity: 12 },
        { canonicalId: "B-1", quantity: 4 },
        { canonicalId: "B-2", quantity: 3 },
        { canonicalId: "B-3", quantity: 3 },
      ]),
      { catalog },
    );

    expect(result).toMatchObject({
      status: "classified",
      id: "theme-alpha--blue-red",
      label: "Theme Alpha — Blue/Red",
      version: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
      evidence: {
        mainDeckCopies: 50,
        resolvedCopies: 50,
        resolvedShare: 1,
        colors: ["blue", "red"],
        dominant: { title: "Theme Alpha", copies: 40, share: 0.8, distinctCards: 3 },
        runnerUp: { title: "Theme Beta", copies: 10, share: 0.2, distinctCards: 3 },
      },
    });
  });

  it("does not classify from color overlap when source-title evidence is ambiguous", () => {
    const result = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 10 },
        { canonicalId: "A-2", quantity: 8 },
        { canonicalId: "A-3", quantity: 7 },
        { canonicalId: "B-1", quantity: 10 },
        { canonicalId: "B-2", quantity: 8 },
        { canonicalId: "B-3", quantity: 7 },
      ]),
      { catalog },
    );

    expect(result).toMatchObject({
      status: "unclassified",
      id: "unclassified",
      diagnostics: [{ code: "dominant-theme-ambiguous" }],
      evidence: { colors: ["blue", "red"] },
    });
  });

  it("fails closed when deck or catalog evidence is incomplete", () => {
    const partial = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 20 },
        { canonicalId: "A-2", quantity: 10 },
        { canonicalId: "MISSING", quantity: 20 },
      ]),
      { catalog },
    );
    expect(partial).toMatchObject({
      status: "unclassified",
      diagnostics: [{ code: "catalog-coverage-insufficient" }],
      evidence: {
        mainDeckCopies: 50,
        resolvedCopies: 30,
        unresolvedEntries: [{ canonicalId: "MISSING", quantity: 20 }],
      },
    });

    const short = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 4 },
        { canonicalId: "A-2", quantity: 4 },
        { canonicalId: "A-3", quantity: 4 },
      ]),
      { catalog },
    );
    expect(short).toMatchObject({
      status: "unclassified",
      diagnostics: [{ code: "main-deck-too-small" }],
    });
  });

  it("validates injected thresholds instead of silently accepting invalid methodology", () => {
    expect(() =>
      classifyGundamTournamentArchetype(deck([]), {
        catalog,
        thresholds: { minimumDominantThemeShare: 1.1 },
      }),
    ).toThrow('Invalid Gundam archetype classifier threshold "minimumDominantThemeShare"');
  });

  it("treats exact resolved-share and dominant-share boundaries as sufficient", () => {
    const resolvedBoundary = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 12 },
        { canonicalId: "A-2", quantity: 12 },
        { canonicalId: "A-3", quantity: 12 },
        { canonicalId: "MISSING", quantity: 4 },
      ]),
      { catalog },
    );
    expect(resolvedBoundary).toMatchObject({
      status: "classified",
      evidence: { resolvedShare: 0.9 },
    });

    const dominantBoundary = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 5 },
        { canonicalId: "A-2", quantity: 5 },
        { canonicalId: "A-3", quantity: 4 },
        { canonicalId: "B-1", quantity: 4 },
        { canonicalId: "B-2", quantity: 3 },
        { canonicalId: "B-3", quantity: 3 },
        { canonicalId: "C-1", quantity: 3 },
        { canonicalId: "C-2", quantity: 3 },
        { canonicalId: "C-3", quantity: 2 },
        { canonicalId: "D-1", quantity: 3 },
        { canonicalId: "D-2", quantity: 3 },
        { canonicalId: "D-3", quantity: 2 },
      ]),
      { catalog },
    );
    expect(dominantBoundary).toMatchObject({
      status: "classified",
      evidence: {
        dominant: { title: "Theme Alpha", share: 0.35 },
        runnerUp: { title: "Theme Beta", share: 0.25 },
      },
    });
  });

  it("treats the exact lead boundary as sufficient and rejects a smaller lead", () => {
    const exact = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 7 },
        { canonicalId: "A-2", quantity: 7 },
        { canonicalId: "A-3", quantity: 6 },
        { canonicalId: "B-1", quantity: 6 },
        { canonicalId: "B-2", quantity: 5 },
        { canonicalId: "B-3", quantity: 5 },
        { canonicalId: "C-1", quantity: 2 },
        { canonicalId: "C-2", quantity: 1 },
        { canonicalId: "C-3", quantity: 1 },
      ]),
      { catalog },
    );
    expect(exact).toMatchObject({
      status: "classified",
      evidence: { dominant: { share: 0.5 }, runnerUp: { share: 0.4 } },
    });

    const below = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 7 },
        { canonicalId: "A-2", quantity: 7 },
        { canonicalId: "A-3", quantity: 6 },
        { canonicalId: "B-1", quantity: 6 },
        { canonicalId: "B-2", quantity: 6 },
        { canonicalId: "B-3", quantity: 5 },
        { canonicalId: "C-1", quantity: 1 },
        { canonicalId: "C-2", quantity: 1 },
        { canonicalId: "C-3", quantity: 1 },
      ]),
      { catalog },
    );
    expect(below).toMatchObject({
      status: "unclassified",
      diagnostics: [{ code: "dominant-theme-ambiguous" }],
    });
  });

  it("requires three dominant identities and a legal one-or-two-color identity", () => {
    const tooNarrow = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 20 },
        { canonicalId: "A-2", quantity: 20 },
      ]),
      { catalog },
    );
    expect(tooNarrow).toMatchObject({
      status: "unclassified",
      diagnostics: [{ code: "dominant-theme-too-narrow" }],
    });

    const threeColors = classifyGundamTournamentArchetype(
      deck([
        { canonicalId: "A-1", quantity: 14 },
        { canonicalId: "A-2", quantity: 13 },
        { canonicalId: "A-3", quantity: 12 },
        { canonicalId: "A-4", quantity: 1 },
      ]),
      { catalog },
    );
    expect(threeColors).toMatchObject({
      status: "unclassified",
      diagnostics: [{ code: "color-identity-invalid" }],
      evidence: { colors: ["blue", "green", "red"] },
    });
  });
});
