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
} from "@tcg/alpha-clash-server-adapter/practice";
import { runAlphaClashPracticeMatch } from "./alpha-clash/runner.ts";
import {
  alphaClashHeuristicCommand,
  ALPHA_CLASH_HEURISTICS,
} from "@tcg/alpha-clash-server-adapter/practice";
import { Spec } from "../../../../../alpha-clash/packages/engine/src/testing/index.ts";
import { applyCommand } from "../../../../../alpha-clash/packages/engine/src/index.ts";

function previewFixture(): AlphaClashLabDeck {
  const counts = new Map<string, number>();
  for (const card of previewDeck()) counts.set(card.name, (counts.get(card.name) ?? 0) + 1);
  return {
    id: "test-preview",
    name: "Test preview",
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
      ["season3-undefendable-clarity", 51, 11],
      ["season3-fexar-clarity", 50, 10],
      ["season3-xiii-war", 60, 0],
      ["season3-sloppy-valen", 50, 0],
      ["season3-silou-death", 56, 9],
      ["season3-silou-clarity", 54, 10],
      ["season3-avalogaming-kilimanjaro", 54, 15],
    ]);
    expect(
      ALPHA_CLASH_META_DECKS.every(
        (deck) =>
          /^https:\/\/(www\.deckplanet\.net|op-deckplanet\.com)\/alpha_clash\/deck\//.test(
            deck.source,
          ) && deck.resultSource.startsWith("https://alphaclashtcg.com/"),
      ),
    ).toBe(true);
  });

  it("records mutable sources and the recovered cached list without claiming historical submissions", () => {
    const imported = ALPHA_CLASH_META_DECKS.filter((deck) => deck.id.startsWith("season3-"));
    expect(imported).toHaveLength(7);
    expect(
      imported.every((deck) => deck.sourceRetrievedOn === "2026-10-11" && deck.sourceNote),
    ).toBe(true);
    expect(
      imported.find((deck) => deck.id === "season3-undefendable-clarity")?.sourceNote,
    ).toContain("web cache");
    expect(imported.find((deck) => deck.id === "season3-xiii-war")?.sourceNote).toContain(
      "not a verified Season 3 submission",
    );
    expect(new Set(ALPHA_CLASH_META_DECKS.map((deck) => deck.source)).size).toBe(9);
    expect(new Set(ALPHA_CLASH_META_DECKS.map((deck) => deck.id)).size).toBe(9);
  });

  it("schedules only admitted Season 3 lists, with mirrors and every cross match", () => {
    const pairs = adapter.getPromotionDeckPairs("season3");
    expect(pairs).toHaveLength(36);
    expect([...new Set(pairs.flatMap((pair) => [pair.deckA, pair.deckB]))]).toEqual([
      "clarity-hyper-aggro",
      "season3-undefendable-clarity",
      "season3-fexar-clarity",
      "season3-xiii-war",
      "season3-sloppy-valen",
      "season3-silou-death",
      "season3-silou-clarity",
      "season3-avalogaming-kilimanjaro",
    ]);
    for (const pair of pairs) {
      expect(() => resolveAlphaClashLabDeck(pair.deckA)).not.toThrow();
      expect(() => resolveAlphaClashLabDeck(pair.deckB)).not.toThrow();
    }
    expect(
      buildPairedSchedule({
        suiteId: "season3",
        seedBase: "season3-admission",
        deckPairs: pairs,
        blocksPerPair: 1,
      }).matches,
    ).toHaveLength(128);
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
      card.cardType === "contender" && card.id === titan.id
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

  it("resolves supported lists and reports card debt for blocked imports", () => {
    const ready = [];
    for (const deck of ALPHA_CLASH_META_DECKS) {
      const audit = auditAlphaClashDeck(deck);
      if (!audit.ready) {
        expect(audit.issues.some((issue) => issue.zone !== "side")).toBe(true);
        expect(() => resolveAlphaClashLabDeck(deck.id)).toThrow("not executable");
        continue;
      }
      ready.push(deck.id);
      expect(audit.issues).toEqual([]);
      expect(resolveAlphaClashLabDeck(deck.id).deckIds).toHaveLength(
        deck.main.reduce((sum, row) => sum + row.count, 0),
      );
    }
    expect(ready).toEqual([
      "clarity-hyper-aggro",
      "absence-makati",
      "season3-undefendable-clarity",
      "season3-fexar-clarity",
      "season3-xiii-war",
      "season3-sloppy-valen",
      "season3-silou-death",
      "season3-silou-clarity",
      "season3-avalogaming-kilimanjaro",
    ]);
  });

  it("runs the exact Kilimanjaro list despite its constructed restriction", () => {
    const deck = ALPHA_CLASH_META_DECKS.find(
      (entry) => entry.id === "season3-avalogaming-kilimanjaro",
    )!;
    expect(auditAlphaClashDeck(deck)).toMatchObject({ ready: true, issues: [] });
    const input = {
      blockId: "casual-construction",
      legId: "kilimanjaro",
      seed: "season3-card-support-season3-avalogaming-kilimanjaro",
      candidateSeat: "p1" as const,
      candidateDeckId: deck.id,
      baselineDeckId: "clarity-hyper-aggro",
      candidateStrategyId: "meta-v1",
      baselineStrategyId: "meta-v1",
      candidateDeck: resolveAlphaClashLabDeck(deck.id),
      baselineDeck: resolveAlphaClashLabDeck("clarity-hyper-aggro"),
    };
    const record = runAlphaClashPracticeMatch(input);
    expect(record.termination).toBe("rules-win");
    expect(record.diagnostics?.illegalProposals).toBe(0);
    expect(runAlphaClashPracticeMatch(input)).toEqual(record);
  }, 30_000);

  it("admits non-constructed deck sizes and copy counts but rejects malformed quantities", () => {
    const fixture = previewFixture();
    const main = [{ ...fixture.main[0]!, count: 5 }];
    expect(auditAlphaClashDeck({ ...fixture, main })).toMatchObject({
      ready: true,
      mainCount: 5,
      issues: [],
    });
    for (const count of [-1, 0, 1.5])
      expect(auditAlphaClashDeck({ ...fixture, main: [{ ...main[0]!, count }] })).toMatchObject({
        ready: false,
        issues: [{ reason: "invalid-count" }],
      });
  });

  it("proposes all four declared targets and a legal Manifest payment without mutating the live board", () => {
    const cycle = allCards().find((card) => card.name === "Endless Cycle")!;
    const valen = allCards().find((card) => card.name === "Valen Solariel, Healer of Eldralore")!;
    const recall = allCards().find((card) => card.name === "Cybernetic Recall")!;
    const game = Spec.fromFixture({
      playerOne: {
        contender: valen,
        hand: [cycle],
        oblivion: [recall, recall, recall, recall],
        deck: [recall, recall, recall, recall],
      },
    });
    const before = structuredClone(game.state);
    const command = alphaClashHeuristicCommand(
      game.state,
      "player-one",
      ALPHA_CLASH_HEURISTICS["meta-v2"]!,
    );
    expect(game.state).toEqual(before);
    expect(command).toMatchObject({ type: "playCard", manifest: true });
    if (command?.type !== "playCard") throw new Error("Expected the targeted Action proposal");
    expect(command.targetId).toBeDefined();
    expect(command.targetIds).toHaveLength(3);
    expect(applyCommand(game.state, command).success).toBe(true);
    expect(game.state.manifestedThisTurn["player-one"]).toBe(true);
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

  it("plays the two imported ready lists through native commands", () => {
    const record = runAlphaClashPracticeMatch({
      blockId: "season3-import",
      legId: "p1",
      seed: "alpha-season3-import",
      candidateSeat: "p1",
      candidateDeckId: "season3-undefendable-clarity",
      baselineDeckId: "season3-fexar-clarity",
      candidateStrategyId: "meta-v1",
      baselineStrategyId: "meta-v1",
      candidateDeck: resolveAlphaClashLabDeck("season3-undefendable-clarity"),
      baselineDeck: resolveAlphaClashLabDeck("season3-fexar-clarity"),
    });
    expect(record).toMatchObject({
      termination: "rules-win",
      diagnostics: { illegalProposals: 0 },
    });
    expect(record.actionCount).toBeGreaterThan(20);
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

it("registers Expert with full information and finishes a reproducible native game", async () => {
  const manifest = await adapter.train?.({
    candidateId: "expert-oracle",
    parentStrategyId: "meta-v1",
  });
  if (!manifest) throw Error("Missing manifest");
  expect(adapter.getCandidateDescriptor(manifest)).toMatchObject({
    id: "expert-oracle",
    strategyVersion: "2",
    informationPolicy: "oracle",
  });
  const input = {
    blockId: "expert-test",
    legId: "p1",
    seed: "expert-local-proof",
    candidateSeat: "p1" as const,
    candidateDeckId: "preview-titan",
    baselineDeckId: "preview-warden",
    candidateStrategyId: "expert-oracle",
    baselineStrategyId: "meta-v1",
    candidateDeck: { contenderId: titan.id, deckIds: previewDeckIds() },
    baselineDeck: { contenderId: warden.id, deckIds: previewDeckIds() },
  };
  const first = runAlphaClashPracticeMatch(input);
  expect(first.termination).toBe("rules-win");
  expect(first.diagnostics?.illegalProposals).toBe(0);
  expect(first.diagnostics?.expertMaxNodes).toBeLessThanOrEqual(768);
  expect(runAlphaClashPracticeMatch(input)).toEqual(first);
}, 120_000);

it("keeps physical decks and shuffle fixed across swapped controller legs", () => {
  const starts: string[] = [];
  const deckA = { contenderId: titan.id, deckIds: previewDeckIds() };
  const deckB = { contenderId: warden.id, deckIds: previewDeckIds() };
  for (const swapped of [false, true]) {
    runAlphaClashPracticeMatch({
      blockId: "shuffle-proof",
      legId: swapped ? "a-seat-2" : "a-seat-1",
      seed: swapped ? "different-leg-2" : "different-leg-1",
      shuffleSeed: "same-native-shuffle",
      candidateSeat: swapped ? "p2" : "p1",
      candidateDeckId: swapped ? "b" : "a",
      baselineDeckId: swapped ? "a" : "b",
      candidateDeck: swapped ? deckB : deckA,
      baselineDeck: swapped ? deckA : deckB,
      maxActions: 1,
      observe(state, command) {
        if (!command)
          starts.push(
            JSON.stringify({
              cards: state.cards,
              deckOrder: state.deckOrder,
              rngState: state.rngState,
            }),
          );
      },
    });
  }
  expect(starts).toHaveLength(2);
  expect(starts[0]).toBe(starts[1]);
});
