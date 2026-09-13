import { describe, expect, it } from "vitest";
import type { FabCardRef, FabFixtureCardEntry } from "@tcg/flesh-and-blood-engine/testing";
import {
  createDefaultFabPregameSelection,
  FAB_DECK_TEXT_FIXTURES,
  validateFabPregameSelection,
} from "@tcg/flesh-and-blood-engine/simulator";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";

import { createFabLocalPracticeMatch } from "./create-local-practice-match";
import { buildFabPracticeMatchupFixture } from "./practice-matchup-fixture";
import {
  getFabPracticeDeckOption,
  getFabPracticeDeckOptionsByFormatGroup,
  pickRandomClassicConstructedDeckId,
  pickRandomClassicConstructedMatchup,
} from "./practice-deck-options";
import {
  parseFabDeckTextLine,
  resolveCatalogCardByName,
  resolvePracticeDeckSelection,
} from "./resolve-text-deck";

function cardRefId(ref: FabCardRef | undefined): string | undefined {
  if (typeof ref === "string") return ref;
  return ref?.canonicalId;
}

function fixtureIds(
  entries: number | readonly FabFixtureCardEntry[] | undefined,
): readonly string[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => cardRefId(typeof entry === "object" && "card" in entry ? entry.card : entry))
    .filter((id): id is string => id !== undefined);
}

describe("FAB practice deck picker options", () => {
  it("picks a random Classic Constructed deck id for practice open", () => {
    const classicIds = getFabPracticeDeckOptionsByFormatGroup("classic-constructed").map(
      (deck) => deck.id,
    );
    const first = pickRandomClassicConstructedDeckId(() => 0);
    const last = pickRandomClassicConstructedDeckId(() => 0.999);
    expect(classicIds).toContain(first);
    expect(classicIds).toContain(last);
    expect(first).toBe(classicIds[0]);
    expect(last).toBe(classicIds[classicIds.length - 1]);
    expect(getFabPracticeDeckOption(first)?.formatGroup).toBe("classic-constructed");
  });

  it("picks distinct player and bot Classic Constructed decks when possible", () => {
    const classicIds = getFabPracticeDeckOptionsByFormatGroup("classic-constructed").map(
      (deck) => deck.id,
    );
    expect(classicIds.length).toBeGreaterThan(1);

    // First call takes index 0; second call (with exclude) also draws 0 from the reduced pool.
    let calls = 0;
    const matchup = pickRandomClassicConstructedMatchup(() => {
      calls += 1;
      return 0;
    });
    expect(classicIds).toContain(matchup.playerDeckId);
    expect(classicIds).toContain(matchup.botDeckId);
    expect(matchup.playerDeckId).not.toBe(matchup.botDeckId);
    expect(matchup.playerDeckId).toBe(classicIds[0]);
    expect(matchup.botDeckId).toBe(classicIds[1]);
    expect(calls).toBe(2);
  });
});

describe("FAB deck text resolution", () => {
  it("builds a seeded QA matchup with equipment outside each deck", () => {
    const input = {
      player1DeckId: "cc-edinburgh-1st-gravy-bones",
      player2DeckId: "cc-edinburgh-3rd-tuffnut",
      seed: "qa-matchup-seed",
    } as const;
    const first = buildFabPracticeMatchupFixture(input);
    const second = buildFabPracticeMatchupFixture(input);
    const changedSeed = buildFabPracticeMatchupFixture({ ...input, seed: "qa-matchup-seed-2" });
    const player1 = resolvePracticeDeckSelection(input.player1DeckId, input.seed);
    const player2 = resolvePracticeDeckSelection(input.player2DeckId, `${input.seed}:p2`);
    const mainDeckCardCount = (seat: typeof player1) =>
      seat.cardPool.entries
        .filter((entry) => entry.source === "main")
        .reduce((total, entry) => total + entry.quantity, 0);
    const deckCardIds = (fixture: typeof first, player: "player1" | "player2") =>
      fixtureIds(fixture[player]?.hand).concat(fixtureIds(fixture[player]?.deck));
    const equipmentIds = (seat: typeof player1) =>
      seat.cardPool.entries
        .filter((entry) => entry.source === "equipment")
        .map((entry) => entry.canonicalId);

    expect(fixtureIds(first.player1?.hand).length + fixtureIds(first.player1?.deck).length).toBe(
      mainDeckCardCount(player1),
    );
    expect(fixtureIds(first.player2?.hand).length + fixtureIds(first.player2?.deck).length).toBe(
      mainDeckCardCount(player2),
    );
    expect(first.player1?.inventory).toEqual(player1.player.inventory);
    expect(first.player2?.inventory).toEqual(player2.player.inventory);
    expect(first.player1?.head).toEqual(player1.player.head);
    expect(first.player1?.weapon1).toEqual(player1.player.weapon1);
    expect(first.player2?.head).toEqual(player2.player.head);
    expect(first.player2?.weapon1).toEqual(player2.player.weapon1);
    expect(first).toEqual(second);
    expect(deckCardIds(first, "player1")).not.toEqual(deckCardIds(changedSeed, "player1"));
    expect(deckCardIds(first, "player1").some((id) => equipmentIds(player1).includes(id))).toBe(
      false,
    );
    expect(deckCardIds(first, "player2").some((id) => equipmentIds(player2).includes(id))).toBe(
      false,
    );
  });

  it("uses the real structured card import for every practice and AI deck", () => {
    const resolutionFailures: string[] = [];
    for (const fixture of FAB_DECK_TEXT_FIXTURES) {
      let seat: ReturnType<typeof resolvePracticeDeckSelection>;
      try {
        seat = resolvePracticeDeckSelection(fixture.id, "structured-card-audit");
      } catch (error) {
        resolutionFailures.push(
          `${fixture.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
        continue;
      }
      expect(seat.unresolved, fixture.id).toEqual([]);

      for (const [canonicalId, definition] of Object.entries(seat.cardDefinitions)) {
        const structured = fleshAndBloodStructuredCardsByCanonicalId.get(canonicalId);
        expect(structured, `${fixture.id}: ${definition.name ?? canonicalId}`).toBeDefined();
        // The resolver may take presentation fields from the catalog, but it
        // must preserve the executable abilities from the same canonical card.
        expect(definition.abilities, `${fixture.id}: ${definition.name ?? canonicalId}`).toEqual(
          structured?.abilities,
        );
      }
    }
    expect(resolutionFailures).toEqual([]);
  });

  it("parses FaBrary-style count/name/pitch lines", () => {
    expect(parseFabDeckTextLine("3x Snatch (red)")).toEqual({
      count: 3,
      name: "Snatch",
      pitch: "red",
    });
    expect(parseFabDeckTextLine("1x Balance of Justice")).toEqual({
      count: 1,
      name: "Balance of Justice",
      pitch: undefined,
    });
    expect(parseFabDeckTextLine("# comment")).toBeNull();
    expect(parseFabDeckTextLine("3x Burn Up||Shock (red)")).toEqual({
      count: 3,
      name: "Burn Up // Shock",
      pitch: "red",
    });
  });

  it("resolves pitched catalog cards by printed name and color", () => {
    const snatchRed = resolveCatalogCardByName("Snatch", "red");
    expect(snatchRed?.name).toBe("Snatch");
    expect(snatchRed?.runtime.base.numeric.pitch).toBe(1);

    const gravy = resolveCatalogCardByName("Gravy Bones, Shipwrecked Looter");
    expect(gravy?.runtime.base.typeBox.types).toContain("Hero");
    expect(gravy?.runtime.base.numeric.life).toBe(40);
  });

  it("seats a Classic Constructed tournament list with a hero and opening hand", () => {
    const seat = resolvePracticeDeckSelection("cc-edinburgh-1st-gravy-bones", "test-seed");
    expect(seat.formatGroup).toBe("classic-constructed");
    expect(seat.formatLabel).toBe("Classic Constructed");
    expect(seat.player.heroCardId).toBeTruthy();
    expect(seat.player.life).toBe(40);
    expect(seat.player.hand).toHaveLength(4);
    expect(fixtureIds(seat.player.deck).length).toBeGreaterThan(20);
    expect(Object.keys(seat.cardDefinitions).length).toBeGreaterThan(10);
    expect(seat.unresolved).toEqual([]);
    expect(seat.player.arena).toBeUndefined();
    const inventory = seat.player.inventory;
    const inventorySize = typeof inventory === "number" ? inventory : (inventory ?? []).length;
    expect(inventorySize).toBeGreaterThan(0);
  });

  it("accepts Agile Windup as a Brute hybrid card in Rhinar's registered pool", () => {
    const seat = resolvePracticeDeckSelection("cc-guilherme-coutinho-rhinar", "hybrid-legality");
    const validation = validateFabPregameSelection(
      seat.cardPool,
      createDefaultFabPregameSelection(seat.cardPool),
    );

    expect(validation.issues).not.toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("Agile Windup") }),
    );
    expect(validation.valid).toBe(true);
  });

  it("accepts Jarl Vetreiði's complete Earth and Ice tournament card pool", () => {
    const seat = resolvePracticeDeckSelection("cc-edinburgh-5th-jarl", "essence-legality");
    const validation = validateFabPregameSelection(
      seat.cardPool,
      createDefaultFabPregameSelection(seat.cardPool),
    );

    expect(validation.issues.filter((issue) => issue.code === "hero-supertype-mismatch")).toEqual(
      [],
    );
    expect(validation.valid).toBe(true);
  });

  it.each(["cc-mexico-nats-2025-1st-arakni-crax", "cc-grave-troll-1st-arakni-huntsman"])(
    "accepts every hybrid card in the Arakni tournament pool %s",
    (deckId) => {
      const seat = resolvePracticeDeckSelection(deckId, "arakni-hybrid-legality");
      const validation = validateFabPregameSelection(
        seat.cardPool,
        createDefaultFabPregameSelection(seat.cardPool),
      );

      expect(validation.issues.filter((issue) => issue.code === "hero-supertype-mismatch")).toEqual(
        [],
      );
      expect(validation.valid).toBe(true);
    },
  );

  it("seats a Silver Age tournament list", () => {
    const seat = resolvePracticeDeckSelection("sa-edinburgh-1st-briar", "test-seed");
    expect(seat.formatGroup).toBe("silver-age");
    expect(seat.formatLabel).toBe("Silver Age");
    expect(seat.player.heroCardId).toBeTruthy();
    expect(seat.player.hand).toHaveLength(4);
  });

  it("boots a local match from tournament text decks", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: "cc-edinburgh-1st-gravy-bones",
      player2DeckId: "sa-edinburgh-1st-briar",
      seed: "tournament-practice",
    });
    const viewer = match.runtime.viewer({ role: "player", actorId: "player-1" });
    expect(match.runtime.hasGameEnded()).toBe(false);
    expect(viewer.players["player-1"]?.heroCardId).toBeTruthy();
    expect(viewer.players["player-2"]?.heroCardId).toBeTruthy();
    expect(viewer.players["player-1"]?.zones.hand.length).toBe(4);
  });
});
