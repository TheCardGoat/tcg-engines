import { expect, it } from "vite-plus/test";
import { fleshAndBloodDeckCardLibrary } from "../../../../cards/src/deck-library.ts";
import { playFabMatch } from "../bench/play-match.ts";
import type { FabMatchTranscript } from "../bench/types.ts";
import { FAB_DECK_TEXT_FIXTURES } from "../deck-text-fixtures.ts";

/** Goldfish / dispatcher seats that still advance the game. */
export const PROGRESSING_GENERIC_STRATEGIES = [
  "value-extract",
  "heuristic",
  "never-defend",
  "hero-profile",
  "first-legal",
  "random",
] as const;

/** Seats that refuse to open attacks — pairing two of these stalls. */
export const STALLING_STRATEGIES = ["defend-only", "pass-only"] as const;

export const HERO_STRATEGIES = [
  "rhinar",
  "teklovossen",
  "arakni",
  "valda",
  "aurora",
  "oscilio",
  "zyggy",
  "gravy",
  "marlynn",
  "puffin",
  "pleiades",
  "kayo",
  "lyath",
] as const;

export type SmokeStrategyId =
  | (typeof PROGRESSING_GENERIC_STRATEGIES)[number]
  | (typeof STALLING_STRATEGIES)[number]
  | (typeof HERO_STRATEGIES)[number];

export const SMOKE_TIMEOUT_MS = 120_000;
export const SMOKE_MAX_ACTIONS = 400;
/** Short enough that a converting attacker finishes; long enough to play cards. */
export const SMOKE_STARTING_LIFE = 10;

/**
 * Stable per-case seed, overridable with `FAB_SMOKE_SEED`.
 * Set `FAB_SMOKE_SEED=random` to draw a fresh seed (printed on failure).
 */
export function smokeSeed(caseId: string): string {
  const override = process.env.FAB_SMOKE_SEED?.trim();
  if (!override) return `smoke:${caseId}`;
  if (override === "random") {
    return `smoke:${caseId}:rng:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
  }
  return `smoke:${caseId}:${override}`;
}

export function assertHealthySmokeMatch(played: FabMatchTranscript, seed: string): void {
  const detail = [
    `seed=${seed}`,
    `p1=${played.p1Strategy}`,
    `p2=${played.p2Strategy}`,
    `end=${played.termination}`,
    `actions=${played.actionCount}`,
    `turns=${played.turnCount}`,
    played.error ? `error=${played.error}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  expect(played.actionCount, `no moves played (${detail})`).toBeGreaterThan(0);
  expect(
    ["life", "max-actions"].includes(played.termination),
    `unhealthy termination (${detail})`,
  ).toBe(true);
  if (played.termination === "max-actions") {
    expect(played.actionCount, `ghost tail — loop died before the cap (${detail})`).toBe(
      SMOKE_MAX_ACTIONS,
    );
  }
  expect(
    played.frames.some((frame) => frame.chosen.move === "concede"),
    detail,
  ).toBe(false);
}

export function playSmokeMatch(input: {
  readonly caseId: string;
  readonly p1Strategy: SmokeStrategyId;
  readonly p2Strategy: SmokeStrategyId;
  readonly p1Deck?: string;
  readonly p2Deck?: string;
  readonly allowStrategyHeroMismatch?: boolean;
}): FabMatchTranscript {
  const seed = smokeSeed(input.caseId);
  try {
    const played = playFabMatch({
      cardLibrary: fleshAndBloodDeckCardLibrary,
      seed,
      p1Strategy: input.p1Strategy,
      p2Strategy: input.p2Strategy,
      p1Deck: input.p1Deck,
      p2Deck: input.p2Deck,
      p1Life: SMOKE_STARTING_LIFE,
      p2Life: SMOKE_STARTING_LIFE,
      maxActions: SMOKE_MAX_ACTIONS,
      recordFrames: false,
      allowStrategyHeroMismatch: input.allowStrategyHeroMismatch ?? false,
    });
    assertHealthySmokeMatch(played, seed);
    return played;
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    throw new Error(`${message} (repro seed=${seed})`);
  }
}

export function describeHeroSmoke(
  hero: (typeof HERO_STRATEGIES)[number],
  extras: readonly SmokeStrategyId[] = [],
): void {
  const opponents = ["value-extract", "never-defend", "heuristic", ...extras] as const;
  const heroDeckId = FAB_DECK_TEXT_FIXTURES.find((deck) =>
    deck.hero.toLowerCase().includes(hero.toLowerCase()),
  )?.id;
  for (const opponent of opponents) {
    it(
      `${hero} vs ${opponent} finishes without crash, stall, or concede`,
      () => {
        playSmokeMatch({
          caseId: `${hero}-vs-${opponent}`,
          p1Strategy: hero,
          p2Strategy: opponent,
          ...(heroDeckId ? { p1Deck: heroDeckId } : {}),
          allowStrategyHeroMismatch: heroDeckId === undefined,
        });
      },
      SMOKE_TIMEOUT_MS,
    );
  }
}
