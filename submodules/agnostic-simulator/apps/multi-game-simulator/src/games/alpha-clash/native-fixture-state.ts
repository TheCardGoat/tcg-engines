import { getCard, officialCatalog } from "@tcg/alpha-clash-cards";
import {
  AcTestEngine,
  type AcTestFixture,
  type FixtureCardEntry,
  type PlayerFixture,
} from "@tcg/alpha-clash-engine/testing";

/** Use distinct printed cards for background piles, never the harness preview fillers. */
export function officialFixtureCards(count: number) {
  const seen = new Set<string>();
  return officialCatalog
    .filter((card) => {
      if (card.cardType !== "clash" || seen.has(card.name)) return false;
      seen.add(card.name);
      return true;
    })
    .slice(0, count)
    .map((card) => getCard(card.id));
}

const backgroundCards = officialCatalog
  .map((card) => getCard(card.id))
  .filter(
    (card) =>
      card.cardType === "action" &&
      card.subtype === "basic" &&
      !card.deckRestrictions?.length &&
      !("keywords" in card && card.keywords?.length),
  );
function definition(entry: FixtureCardEntry) {
  return "card" in entry ? entry.card : entry;
}

/** Complete card ledgers for arranged mid-game states; not historical replays. */
export function nativeFixtureState(fixture: AcTestFixture) {
  if (fixture.definitions?.length)
    throw new Error("Native visual fixtures cannot inject card definitions");
  const player = (value: PlayerFixture | undefined, contenderId: string): PlayerFixture => {
    let resources =
      typeof value?.resource === "number"
        ? officialFixtureCards(value.resource)
        : (value?.resource ?? []);
    let deck =
      typeof value?.deck === "number"
        ? officialFixtureCards(value.deck)
        : [...(value?.deck ?? officialFixtureCards(8))];
    const names = new Map<string, number>();
    const reserve = (entry: FixtureCardEntry) => {
      const card = definition(entry);
      names.set(card.name, (names.get(card.name) ?? 0) + 1);
      return entry;
    };
    const fixed = [
      value?.hand,
      value?.clash,
      value?.accessory,
      value?.clashground,
      value?.oblivion,
    ].flatMap((entries) => entries ?? []);
    fixed.forEach(reserve);
    const filler = (colors?: readonly string[]) => {
      const card = backgroundCards.find(
        (card) =>
          (names.get(card.name) ?? 0) < 4 &&
          (!colors ||
            (colors.length === card.colors.length &&
              colors.every((color) => card.colors.some((candidate) => candidate === color)))),
      );
      if (!card) throw new Error("No legal background card for fixture ledger");
      return card;
    };
    // Preserve foreground cards and top-deck order. Replace excess background
    // copies with official basic Actions; resources keep the printed colors.
    resources = resources.map((entry) => {
      const card = definition(entry);
      const limit = "keywords" in card && card.keywords?.includes("unrivaled") ? 1 : 4;
      const replacement = (names.get(card.name) ?? 0) >= limit ? filler(card.colors) : card;
      return reserve("card" in entry ? { ...entry, card: replacement } : replacement);
    });
    deck = deck.map((entry) =>
      reserve((names.get(definition(entry).name) ?? 0) >= 4 ? filler() : entry),
    );
    while (fixed.length + resources.length + deck.length < 50) deck.push(reserve(filler()));
    return {
      ...value,
      contender: value?.contender ?? getCard(contenderId),
      deck,
      resource: resources,
    };
  };
  return AcTestEngine.fromFixture({
    ...fixture,
    seed: fixture.seed ?? 17,
    playerOne: player(fixture.playerOne, "ac-st-001"),
    playerTwo: player(fixture.playerTwo, "ac-ac1-096"),
  });
}
