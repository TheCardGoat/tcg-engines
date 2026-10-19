import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { MATCH_INTRO_BOOTSTRAP, parseMatchIntro, type MatchIntroHandoff } from "./handoff";

const href = "https://tcg.online/gundam/simulator/matches/m1/games/g1?returnTo=%2Fgundam";
const now = 1_800_000_000_000;
const record: MatchIntroHandoff = {
  version: 1,
  destination: href,
  createdAt: now,
  gameName: "Gundam",
  playerName: "Player one",
  opponentName: "Player two",
  heading: "Match starting",
  loadingLabel: "Loading…",
  skipLabel: "Go to match",
};

describe("match intro handoff", () => {
  test("accepts a fresh record only at the exact destination", () => {
    expect(parseMatchIntro(JSON.stringify(record), href, now + 4000)).toEqual(record);
    expect(parseMatchIntro(JSON.stringify(record), href + "#board", now)).toEqual(record);
    for (const wrongHref of [
      href.replace("g1", "g2"),
      href.replace("gundam", "naruto"),
      href.replace("tcg.online", "staging.cardgoat.org"),
      href.split("?")[0],
    ]) {
      expect(parseMatchIntro(JSON.stringify(record), wrongHref, now)).toBeNull();
    }
  });
  test("ignores expired, future, malformed, or incompatible records", () => {
    for (const value of [null, "", "{", "x".repeat(4097), "null", "[]", "true"]) {
      expect(parseMatchIntro(value, href, now)).toBeNull();
    }
    for (const patch of [
      { createdAt: now - 30_001 },
      { createdAt: now + 1 },
      { createdAt: "today" },
      { version: 2 },
      { variant: "unknown" },
      { playerName: {} },
      { skipLabel: null },
      { heading: "x".repeat(201) },
      { destination: "javascript:alert(1)" },
    ]) {
      expect(parseMatchIntro(JSON.stringify({ ...record, ...patch }), href, now)).toBeNull();
    }
  });
  test("does not allow a record to mask unrelated routes", () => {
    const destination = "https://tcg.online/gundam/matchmaking";
    expect(
      parseMatchIntro(JSON.stringify({ ...record, destination }), destination, now),
    ).toBeNull();
  });
});

test("the static first-paint bootstrap agrees with hydration validation", () => {
  const cases = [
    null,
    "",
    "{",
    "x".repeat(4097),
    "null",
    "[]",
    "true",
    ...[
      {},
      { variant: "banners" },
      { createdAt: now - 30_001 },
      { createdAt: now + 1 },
      { createdAt: "today" },
      { version: 2 },
      { variant: "unknown" },
      { playerName: {} },
      { skipLabel: null },
      { heading: "x".repeat(201) },
      { destination: "javascript:alert(1)" },
      { destination: href.replace("g1", "g2") },
      { destination: href.replace("tcg.online", "staging.cardgoat.org") },
      { destination: href.split("?")[0] },
    ].map((patch) => JSON.stringify({ ...record, ...patch })),
  ];
  for (const raw of cases) {
    const window: { __tcgMatchIntro?: MatchIntroHandoff } = {};
    const document = { documentElement: { dataset: {} } };
    runInNewContext(MATCH_INTRO_BOOTSTRAP, {
      window,
      document,
      URL,
      Date: { now: () => now },
      location: { href },
      performance: { getEntriesByType: () => [{ type: "navigate" }] },
      sessionStorage: { getItem: () => raw, removeItem: () => {} },
      addEventListener: () => {},
      setTimeout: () => 1,
      clearTimeout: () => {},
    });
    expect(window.__tcgMatchIntro ?? null).toEqual(parseMatchIntro(raw, href, now));
  }
});
