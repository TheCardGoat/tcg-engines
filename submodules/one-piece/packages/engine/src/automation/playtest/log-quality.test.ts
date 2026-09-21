/**
 * Regression tests for player-facing log quality in bot matches.
 *
 * Plays the seeded heuristic-vs-aggressive matchup through the production
 * runner and asserts the emitted log survives the log-quality audit: no
 * double-logged draws or plays, no developer jargon, no vague target
 * prompts, and no byte-identical adjacent duplicate lines. Also guards the
 * flip side: suppressing raw zone-movement lines must not lose the semantic
 * "draws N card(s)" / "plays X" lines.
 */

import { describe, test } from "vite-plus/test";
import { strict as assert } from "node:assert";
import { playGame, type GameRecord, type PlaytestStyleId } from "./runner.ts";
import { auditGameLog, type LogAuditFinding } from "./log-audit.ts";
import type { TestDeckId } from "../test-decks.ts";

interface LogQualityGameConfig {
  readonly seed: string;
  readonly firstPlayer: "south" | "north";
  readonly southStyle: PlaytestStyleId;
  readonly southDeck: TestDeckId;
  readonly northStyle: PlaytestStyleId;
  readonly northDeck: TestDeckId;
}

/**
 * Fixed configs: heuristic red-aggro vs aggressive yellow-trigger is known to
 * exercise every audited category. The 52000 seeds additionally exercise
 * battle K.O.s, effect K.O.s, and life-look prompts. The 74000 seeds add
 * naive-strategy matchups (greedy/valueRanked) so their distinct prompt
 * surface — cost payments, Oden-style setActive counts, DON!! attach lines —
 * is audited too.
 */
const GAMES: readonly LogQualityGameConfig[] = [
  {
    seed: "41000-m05",
    firstPlayer: "south",
    southStyle: "heuristic",
    southDeck: "red-aggro",
    northStyle: "aggressive",
    northDeck: "yellow-trigger",
  },
  {
    seed: "41000-m06",
    firstPlayer: "north",
    southStyle: "heuristic",
    southDeck: "red-aggro",
    northStyle: "aggressive",
    northDeck: "yellow-trigger",
  },
  {
    seed: "52000-m5-g1",
    firstPlayer: "south",
    southStyle: "heuristic",
    southDeck: "red-aggro",
    northStyle: "aggressive",
    northDeck: "yellow-trigger",
  },
  {
    seed: "52000-m6-g1",
    firstPlayer: "north",
    southStyle: "heuristic",
    southDeck: "red-aggro",
    northStyle: "aggressive",
    northDeck: "yellow-trigger",
  },
  {
    seed: "74000-m7-g2",
    firstPlayer: "north",
    southStyle: "greedy",
    southDeck: "blue-control",
    northStyle: "valueRanked",
    northDeck: "purple-ramp",
  },
  {
    seed: "74000-m12-g1",
    firstPlayer: "south",
    southStyle: "valueRanked",
    southDeck: "green-midrange",
    northStyle: "heuristic",
    northDeck: "yellow-trigger",
  },
];

let cachedGames: GameRecord[] | null = null;

function playedGames(): GameRecord[] {
  cachedGames ??= GAMES.map((game, index) =>
    playGame({
      matchId: "log-quality",
      gameInMatch: index + 1,
      gameId: `log-quality-${index + 1}`,
      southDeck: game.southDeck,
      northDeck: game.northDeck,
      southStyle: game.southStyle,
      northStyle: game.northStyle,
      firstPlayer: game.firstPlayer,
      seed: game.seed,
    }),
  );
  return cachedGames;
}

function finding(audit: { findings: LogAuditFinding[] }, category: string): LogAuditFinding | null {
  return audit.findings.find((entry) => entry.category === category) ?? null;
}

describe("One Piece playtest log quality", () => {
  test("games complete naturally without illegal commands", () => {
    for (const game of playedGames()) {
      assert.strictEqual(game.illegalCommands, 0, `${game.gameId}: illegal commands`);
      assert.ok(
        game.naturalCompletion,
        `${game.gameId}: ended by ${game.termination} (${game.finishReason ?? "no reason"})`,
      );
    }
  }, 120000);

  test("audit reports zero known log-quality defects", () => {
    for (const game of playedGames()) {
      const audit = auditGameLog(game.logs);
      for (const category of [
        "double-logged-draw",
        "double-logged-play",
        "unformatted-life-look",
        "battle-ko-double-line",
        "effect-ko-double-line",
        "dev-jargon",
        "vague-target",
        "empty-prevention-target",
        "double-space-in-line",
        "requirement-reads-as-event",
        "unpunctuated-line",
      ] as const) {
        const entry = finding(audit, category);
        assert.strictEqual(
          entry?.count ?? 0,
          0,
          `${game.gameId}: ${category} flagged: ${entry?.example ?? ""}`,
        );
      }
    }
  }, 120000);

  test("no developer jargon leaks into log lines", () => {
    for (const game of playedGames()) {
      const offender = game.logs.find((line) => /\bonPlay\b|effect resolution/.test(line));
      assert.strictEqual(offender, undefined, `${game.gameId}: dev jargon: ${offender ?? ""}`);
    }
  }, 120000);

  test("no log line is the bare life-look fragment", () => {
    for (const game of playedGames()) {
      const offender = game.logs.find((line) => line.endsWith("looks at Life"));
      assert.strictEqual(
        offender,
        undefined,
        `${game.gameId}: bare life-look fragment: ${offender ?? ""}`,
      );
    }
  }, 120000);

  test("K.O. logs a single semantic line, not the raw trash movement", () => {
    for (const game of playedGames()) {
      const audit = auditGameLog(game.logs);
      for (const category of ["battle-ko-double-line", "effect-ko-double-line"] as const) {
        const entry = finding(audit, category);
        assert.strictEqual(
          entry?.count ?? 0,
          0,
          `${game.gameId}: ${category} flagged ${entry?.count ?? 0}x: ${entry?.example ?? ""}`,
        );
      }
    }
  }, 120000);

  test("target prompts name their candidates", () => {
    for (const game of playedGames()) {
      const offender = game.logs.find((line) => line.endsWith("needs a target"));
      assert.strictEqual(
        offender,
        undefined,
        `${game.gameId}: vague target line: ${offender ?? ""}`,
      );
    }
  }, 120000);

  test("a prevents line with an empty target list is flagged as a defect", () => {
    // OP04-100 Capone"Gang"Bege declined its optional trigger and still
    // asserted a prevention: the empty target list left a double-space gap.
    const declined = auditGameLog(['Capone"Gang"Bege prevents  from attacking this turn.']);
    const flagged = finding(declined, "empty-prevention-target");
    assert.ok(flagged, "empty-target prevents line was not flagged");
    assert.strictEqual(flagged.count, 1);
    assert.strictEqual(flagged.severity, "defect");

    const wellFormed = auditGameLog([
      'Capone"Gang"Bege prevents Charlotte Katakuri from attacking this turn.',
    ]);
    assert.strictEqual(finding(wellFormed, "empty-prevention-target"), null);
  });

  test("a gives line with an empty target list is flagged as a defect", () => {
    // "Up to 1" power/cost/keyword grants resolved with zero targets left an
    // empty target list inside the "gives ... this turn" templates, rendering
    // a double-space gap where the target name should be.
    const bad = auditGameLog(["Gum-Gum Fire-Fist Pistol Red Hawk gives  -10000 power this turn."]);
    const flagged = finding(bad, "double-space-in-line");
    assert.ok(flagged, "empty-target gives line was not flagged");
    assert.strictEqual(flagged.count, 1);
    assert.strictEqual(flagged.severity, "defect");

    const wellFormed = auditGameLog([
      "Gum-Gum Fire-Fist Pistol Red Hawk gives King -10000 power this turn.",
    ]);
    assert.strictEqual(finding(wellFormed, "double-space-in-line"), null);
  });

  test("no byte-identical adjacent duplicate lines", () => {
    for (const game of playedGames()) {
      const entry = finding(auditGameLog(game.logs), "consecutive-duplicate");
      assert.strictEqual(
        entry?.count ?? 0,
        0,
        `${game.gameId}: ${entry?.count ?? 0} duplicate lines, e.g. ${entry?.example ?? ""}`,
      );
    }
  }, 120000);

  test("semantic draw and play lines survive log suppression", () => {
    for (const game of playedGames()) {
      assert.ok(
        game.logs.some((line) => / draws? \d+ card/.test(line)),
        `${game.gameId}: no 'draws N card(s)' line`,
      );
      assert.ok(
        game.logs.some((line) => / plays /.test(line)),
        `${game.gameId}: no 'plays' line`,
      );
    }
  }, 120000);
});
