import { describe, expect, it } from "vite-plus/test";
import { buildPairedSchedule } from "@tcg/bot-core";
import { botCandidateManifestV1Schema } from "@tcg/bot-core/schemas";
import {
  allCards,
  previewDeck,
  previewDeckIds,
  titan,
  warden,
} from "../../../../../alpha-clash/packages/cards/src/index.ts";
import { alphaClashBotLabAdapter as adapter } from "./alpha-clash.ts";
import {
  ALPHA_CLASH_META_DECKS,
  auditAlphaClashDeck,
  containsUnparsed,
  resolveAlphaClashLabDeck,
  type AlphaClashLabDeck,
} from "./alpha-clash/decks.ts";
import { runAlphaClashPracticeMatch } from "./alpha-clash/runner.ts";
import { alphaClashHeuristicCommand, ALPHA_CLASH_HEURISTICS } from "./alpha-clash/policy.ts";
import { Spec } from "../../../../../alpha-clash/packages/engine/src/testing/index.ts";
import { applyCommand } from "../../../../../alpha-clash/packages/engine/src/index.ts";

function previewFixture(): AlphaClashLabDeck {
  const counts = new Map<string, number>();
  for (const card of previewDeck()) counts.set(card.name, (counts.get(card.name) ?? 0) + 1);
  return {
    id: "test-preview",
    contender: titan.name,
    source: "test fixture",
    resultSource: "test fixture",
    result: "Engine calibration only; not a meta deck",
    main: [...counts].map(([name, count]) => ({ name, count })),
    side: [],
  };
}

describe("Alpha Clash BotLab", () => {
  it("preserves the published deck sizes and sources", () => {
    expect(
      ALPHA_CLASH_META_DECKS.map((deck) => {
        const audit = auditAlphaClashDeck(deck);
        return [deck.id, audit.mainCount, audit.sideCount];
      }),
    ).toEqual([
      ["clarity-hyper-aggro", 50, 10],
      ["absence-makati", 60, 15],
    ]);
    expect(
      ALPHA_CLASH_META_DECKS.every(
        (deck) =>
          deck.source.startsWith("https://www.deckplanet.net/") &&
          deck.resultSource.startsWith("https://alphaclashtcg.com/"),
      ),
    ).toBe(true);
  });

  it("audits all missing cards before admission", () => {
    const fixture = previewFixture();
    const audit = auditAlphaClashDeck(fixture, []);
    expect(audit.ready).toBe(false);
    expect(audit.issues).toHaveLength(fixture.main.length + 1);
    expect(audit.issues.every((issue) => issue.reason === "missing-definition")).toBe(true);
    expect(() => resolveAlphaClashLabDeck("clarity-hyper-aggro", [])).toThrow("not executable");
    expect(() => resolveAlphaClashLabDeck("not-a-deck")).toThrow(
      "Unknown Alpha Clash bot-lab deck",
    );
  });

  it("rejects unparsed behavior nested inside an effect branch", () => {
    expect(
      containsUnparsed({
        abilities: [
          {
            kind: "triggered",
            effects: [{ kind: "if", then: [{ kind: "unparsed", text: "not executed" }] }],
          },
        ],
      }),
    ).toBe(true);
    expect(containsUnparsed({ text: "The word unparsed in printed text is inert." })).toBe(false);
    const fixture = previewFixture();
    const catalog = allCards().map((card) =>
      card.id === titan.id
        ? { ...card, abilities: [{ kind: "unparsed" as const, text: "missing behavior" }] }
        : card,
    );
    expect(auditAlphaClashDeck(fixture, catalog)).toMatchObject({
      ready: false,
      issues: [{ name: titan.name, zone: "contender", reason: "unparsed" }],
    });
  });

  it("admits a complete main deck while reporting sideboard debt separately", () => {
    const fixture = { ...previewFixture(), side: [{ name: "Missing sideboard card", count: 1 }] };
    expect(auditAlphaClashDeck(fixture)).toMatchObject({
      ready: true,
      mainCount: 50,
      issues: [{ name: "Missing sideboard card", zone: "side", reason: "missing-definition" }],
    });
  });

  it("rejects invalid counts and wrong card types", () => {
    const fixture = previewFixture();
    expect(
      auditAlphaClashDeck({ ...fixture, main: [{ name: titan.name, count: 50 }] }),
    ).toMatchObject({ ready: false });
    expect(auditAlphaClashDeck({ ...fixture, contender: fixture.main[0]!.name })).toMatchObject({
      ready: false,
    });
  });

  it("covers both mirrors and both seats and deck assignments in the cross match", () => {
    const pairs = adapter.getPromotionDeckPairs("meta");
    expect(pairs).toHaveLength(3);
    const schedule = buildPairedSchedule({
      suiteId: "meta",
      seedBase: "test",
      deckPairs: pairs,
      blocksPerPair: 1,
    });
    expect(schedule.matches).toHaveLength(8);
    const cross = schedule.matches.filter((match) => match.pairId === "clarity-vs-absence");
    expect(cross).toHaveLength(4);
    expect(new Set(cross.map((match) => `${match.p1Controller}/${match.p1DeckId}`)).size).toBe(4);
    expect(() => adapter.getPromotionDeckPairs("unknown")).toThrow(
      "Unknown Alpha Clash BotLab suite",
    );
  });

  it("builds a schema-valid calibration manifest without claiming training", async () => {
    const manifest = await adapter.train?.({});
    if (!manifest) throw new Error("Missing manifest builder");
    expect(botCandidateManifestV1Schema.parse(manifest)).toEqual(manifest);
    expect(manifest.candidateId).toBe(manifest.parentStrategyId);
    expect(manifest.training).toBeUndefined();
    expect(adapter.getCandidateDescriptor(manifest).productionEligible).toBe(false);
    expect(() =>
      adapter.getCandidateDescriptor({ ...manifest, changes: { attackWeight: 3 } }),
    ).toThrow("Unknown Alpha Clash heuristic");
    expect(() => adapter.train?.({ candidateId: "unimplemented-heuristic" })).toThrow(
      "Unknown Alpha Clash strategy",
    );
  });

  it("runs a real terminal engine match and reproduces the exact record", () => {
    const input = {
      blockId: "calibration",
      legId: "test",
      seed: "alpha-clash-calibration-test",
      candidateSeat: "p1" as const,
      candidateDeckId: "preview-titan",
      baselineDeckId: "preview-warden",
      candidateDeck: { contenderId: titan.id, deckIds: previewDeckIds() },
      baselineDeck: { contenderId: warden.id, deckIds: previewDeckIds() },
    };
    const match = runAlphaClashPracticeMatch(input);
    expect(match.termination).toBe("rules-win");
    expect(match.turnCount).toBeGreaterThan(1);
    expect(match.actionCount).toBeGreaterThan(20);
    expect(runAlphaClashPracticeMatch(input)).toEqual(match);
    const limited = runAlphaClashPracticeMatch({ ...input, maxActions: 2 });
    expect(limited).toMatchObject({ termination: "max-actions", actionCount: 2, winner: null });
  });

  it("admits both exact meta decks with no main or sideboard gaps", () => {
    for (const deck of ALPHA_CLASH_META_DECKS) {
      expect(auditAlphaClashDeck(deck)).toMatchObject({ ready: true, issues: [] });
      expect(resolveAlphaClashLabDeck(deck.id).deckIds).toHaveLength(
        deck.main.reduce((sum, row) => sum + row.count, 0),
      );
    }
  });

  it("consumes valid heuristic overrides and rejects unknown or invalid fields", async () => {
    const manifest = await adapter.train?.({
      candidateId: "meta-v2",
      parentStrategyId: "meta-v1",
      changes: { playBeforeAttack: true, keepClashWeight: 3 },
    });
    if (!manifest) throw new Error("Missing manifest");
    expect(adapter.getCandidateDescriptor(manifest)).toMatchObject({
      id: "meta-v2",
      productionEligible: false,
    });
    expect(() =>
      adapter.getCandidateDescriptor({ ...manifest, changes: { keepClashWeight: -1 } }),
    ).toThrow("between zero and twenty");
    expect(() =>
      adapter.getCandidateDescriptor({ ...manifest, changes: { attackWeight: 5 } }),
    ).toThrow("Unknown Alpha Clash heuristic");
  });

  it("changes attack order while keeping legality checks isolated from the live match", () => {
    const haven = allCards().find((card) => card.name === "Haven, the Resourceful Helper")!;
    const game = Spec.fromFixture({ playerOne: { hand: [haven], resource: [haven] } });
    const before = structuredClone(game.state);
    const attackFirst = alphaClashHeuristicCommand(
      game.state,
      "player-one",
      ALPHA_CLASH_HEURISTICS["meta-v1"]!,
    );
    const playFirst = alphaClashHeuristicCommand(
      game.state,
      "player-one",
      ALPHA_CLASH_HEURISTICS["meta-v2"]!,
    );
    expect(attackFirst?.type).toBe("initiateClash");
    expect(playFirst?.type).toBe("playCard");
    expect(game.state).toEqual(before);
    expect(playFirst && applyCommand(game.state, playFirst).success).toBe(true);
  });

  it("completes an exact meta-deck game with legal commands and reproduces it", () => {
    const input = {
      blockId: "meta-proof",
      legId: "p1",
      seed: "alpha-meta-proof",
      candidateSeat: "p1" as const,
      candidateDeckId: "clarity-hyper-aggro",
      baselineDeckId: "absence-makati",
      candidateStrategyId: "meta-v3",
      baselineStrategyId: "meta-v1",
      candidateDeck: resolveAlphaClashLabDeck("clarity-hyper-aggro"),
      baselineDeck: resolveAlphaClashLabDeck("absence-makati"),
    };
    let observations = 0;
    const record = runAlphaClashPracticeMatch({
      ...input,
      observe() {
        observations++;
      },
    });
    expect(observations).toBe(record.actionCount + 1);
    expect(record).toMatchObject({
      termination: "rules-win",
      diagnostics: { illegalProposals: 0 },
    });
    expect(runAlphaClashPracticeMatch(input)).toEqual(record);
  }, 30_000);

  it("meta-v3 builds the board first only for a Contender with Void replay", () => {
    const haven = allCards().find((card) => card.name === "Haven, the Resourceful Helper")!;
    const gur = allCards().find((card) => card.name === "Gur, Savage Aggressor")!;
    const absence = allCards().find((card) => card.name === "The Absence, Voice of the Void")!;
    const ordinary = Spec.fromFixture({ playerOne: { hand: [haven], resource: [haven] } });
    const voidDeck = Spec.fromFixture({
      playerOne: { contender: absence, hand: [gur], resource: [gur] },
    });
    expect(
      alphaClashHeuristicCommand(ordinary.state, "player-one", ALPHA_CLASH_HEURISTICS["meta-v3"]!)
        ?.type,
    ).toBe("initiateClash");
    expect(
      alphaClashHeuristicCommand(voidDeck.state, "player-one", ALPHA_CLASH_HEURISTICS["meta-v3"]!)
        ?.type,
    ).toBe("playCard");
  });
});
