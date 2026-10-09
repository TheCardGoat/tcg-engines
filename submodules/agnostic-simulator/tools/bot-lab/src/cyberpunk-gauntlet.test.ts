import { expect, it } from "vite-plus/test";
import {
  gauntletStrategies,
  mirrorSchedule,
  standings,
  selectGauntletDecks,
  type GauntletRow,
} from "./cyberpunk-gauntlet.ts";

it("uses identical decks and common shuffle seeds for every strategy pair and both seats", () => {
  const games = mirrorSchedule(["deck-a", "deck-b", "deck-c"], ["a", "b", "c"], 2, "test");
  expect(games).toHaveLength(36);
  for (let index = 0; index < games.length; index += 2) {
    const first = games[index]!,
      second = games[index + 1]!;
    expect(first.swap).toBe(false);
    expect(second.swap).toBe(true);
    expect(first.deckA).toBe(first.deckB);
    expect(second.deckA).toBe(first.deckA);
    expect(second.seed).toBe(first.seed);
    expect(second.block).toBe(first.block);
  }
  expect(
    new Set(games.filter((game) => game.deckA === "deck-a").map((game) => game.seed)).size,
  ).toBe(2);
});

it("does not credit wins that come from an automation concession", () => {
  const games = mirrorSchedule(["deck-a"], ["expert-oracle", "tactical"], 1, "test");
  const rows: GauntletRow[] = games.map((game, index) => ({
    ...game,
    winner: "a",
    reason: index ? "illegal" : "winCondition",
    valid: index === 0,
    failedStrategy: index ? "tactical" : null,
    actions: 1,
    turns: 1,
    finalHash: "test",
    traceHash: "test",
    elapsedMs: 0,
  }));
  const ranked = standings(rows, ["expert-oracle", "tactical"], "strategy");
  expect(ranked[0]).toMatchObject({
    id: "expert-oracle",
    wins: 1,
    validGames: 1,
    failures: 1,
    eligible: true,
  });
  expect(ranked[1]).toMatchObject({ id: "tactical", losses: 1, ownFailures: 1, eligible: false });
});

it("includes all distinct registered and experimental strategies and excludes the default alias", () => {
  expect(gauntletStrategies).toHaveLength(14);
  expect(new Set(gauntletStrategies.map((strategy) => strategy.id)).size).toBe(14);
  expect(gauntletStrategies.some((strategy) => strategy.id === "default")).toBe(false);
  expect(
    gauntletStrategies.find((strategy) => strategy.id === "tactical-ability-aware"),
  ).toBeDefined();
});

it("accepts explicit authored decks and rejects invalid or repeated ids", () => {
  const ids = [
    "authored-cyberpsychosis-deadman-burst-insurance",
    "authored-yorinobu-two-units-for-one",
    "authored-ryg-low-cost-value",
  ];
  expect(selectGauntletDecks()).toBeUndefined();
  expect(selectGauntletDecks(ids)).toEqual(ids);
  expect(selectGauntletDecks(ids)).not.toBe(ids);
  expect(() => selectGauntletDecks([])).toThrow("at least one");
  expect(() => selectGauntletDecks(["unknown-deck"])).toThrow("Unknown authored deck");
  expect(() => selectGauntletDecks([ids[0]!, ids[0]!])).toThrow("unique");
  const schedule = mirrorSchedule(
    selectGauntletDecks(ids)!,
    gauntletStrategies.map((strategy) => strategy.id),
    2,
    "new-decks/screen",
  );
  expect(schedule).toHaveLength(1092);
  expect(new Set(schedule.map((game) => game.deckA))).toEqual(new Set(ids));
  expect(schedule.every((game) => game.deckA === game.deckB)).toBe(true);
});
