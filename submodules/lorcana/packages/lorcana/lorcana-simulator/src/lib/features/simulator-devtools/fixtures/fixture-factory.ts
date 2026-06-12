import { getLogger } from "@logtape/logtape";
import type { LorcanaCard } from "@tcg/lorcana-engine";
import type { TestInitialState } from "@tcg/lorcana-engine/testing";
import type { LorcanaDeckListResolutionDiagnostics } from "@tcg/lorcana-cards/deck-list-resolver";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

type FixturePlayerInput = Omit<TestInitialState, "deck"> & {
  deck?: TestInitialState["deck"] | string;
};

export type LorcanaSimulatorFixtureInput = Omit<
  LorcanaSimulatorFixture,
  "playerOne" | "playerTwo"
> & {
  playerOne: FixturePlayerInput;
  playerTwo: FixturePlayerInput;
};

const logger = getLogger(["tcg", "core-simulator", "lorcana-simulator", "fixture-factory"]);

// ---------------------------------------------------------------------------
// Lazy card pool — only loaded when a string deck list needs resolving.
// Pre-materialized fixture callers (the vast majority) never trigger this.
// ---------------------------------------------------------------------------

let _cardPoolPromise: Promise<LorcanaCard[]> | null = null;

async function getCardPool(): Promise<LorcanaCard[]> {
  if (!_cardPoolPromise) {
    _cardPoolPromise = (async () => {
      const [m001, m002, m003, m004, m005, m006, m007, m008, m009, m010, m011, m012] =
        await Promise.all([
          import("@tcg/lorcana-cards/cards/001"),
          import("@tcg/lorcana-cards/cards/002"),
          import("@tcg/lorcana-cards/cards/003"),
          import("@tcg/lorcana-cards/cards/004"),
          import("@tcg/lorcana-cards/cards/005"),
          import("@tcg/lorcana-cards/cards/006"),
          import("@tcg/lorcana-cards/cards/007"),
          import("@tcg/lorcana-cards/cards/008"),
          import("@tcg/lorcana-cards/cards/009"),
          import("@tcg/lorcana-cards/cards/010"),
          import("@tcg/lorcana-cards/cards/011"),
          import("@tcg/lorcana-cards/cards/012"),
        ]);

      return [
        ...m001.all001Cards,
        ...m002.all002Cards,
        ...m003.all003Cards,
        ...m004.all004Cards,
        ...m005.all005Cards,
        ...m006.all006Cards,
        ...m007.all007Cards,
        ...m008.all008Cards,
        ...m009.all009Cards,
        ...m010.all010Cards,
        ...m011.all011Cards,
        ...m012.all012Cards,
      ].filter((card) => card?.name != null);
    })();
  }
  return _cardPoolPromise;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isStringDeck(deck: TestInitialState["deck"] | string | undefined): deck is string {
  return typeof deck === "string";
}

function summarizeMultiPrinting(diagnostics: LorcanaDeckListResolutionDiagnostics): void {
  if (diagnostics.multiPrintingSelections.length === 0) return;

  for (const resolution of diagnostics.multiPrintingSelections) {
    if (!resolution.selectedCard) {
      continue;
    }

    logger.info("Resolved decklist card with multiple printings", {
      cardName: resolution.cardName,
      resolvedCardName: resolution.resolvedCardName,
      matchCount: resolution.matchCount,
      matches: resolution.matches.map((match) => ({
        id: match.id,
        rarity: match.rarity,
        set: match.set,
      })),
      selected: {
        id: resolution.selectedCard.id,
        rarity: resolution.selectedCard.rarity,
        set: resolution.selectedCard.set,
      },
    });
  }
}

function throwMalformedEntries(
  fixtureId: string,
  side: "playerOne" | "playerTwo",
  invalid: string,
): never {
  logger.error("Decklist contains malformed lines", {
    fixtureId,
    side,
    invalid,
  });
  throw new Error(`Fixture "${fixtureId}" ${side} decklist contains malformed lines: ${invalid}`);
}

async function parseDeckFromText(
  side: "playerOne" | "playerTwo",
  fixtureId: string,
  deckText: string,
): Promise<LorcanaCard[]> {
  logger.info("Parsing decklist text for fixture", {
    fixtureId,
    side,
    textLength: deckText.length,
  });

  const allCards = await getCardPool();
  const { resolveLorcanaDeckListTextFromPool } =
    await import("@tcg/lorcana-cards/deck-list-resolver");
  const { resolvedByCardName, cards, diagnostics } = resolveLorcanaDeckListTextFromPool(
    deckText,
    allCards,
  );

  logger.debug("Decklist parse result", {
    entries: diagnostics.parsedEntriesCount,
    fixtureId,
    malformedLines: diagnostics.malformedLines.length,
    side,
  });

  if (diagnostics.malformedLines.length > 0) {
    const invalid = diagnostics.malformedLines
      .map((entry) => (entry.lineNumber ? `line ${entry.lineNumber}: ${entry.text}` : entry.text))
      .join("; ");
    throwMalformedEntries(fixtureId, side, invalid);
  }

  const uniqueCardCount = resolvedByCardName.size;
  logger.debug("Resolved unique decklist card names", {
    fixtureId,
    side,
    uniqueCardCount,
  });

  if (diagnostics.unresolvedNames.length > 0) {
    const unknownCard = diagnostics.unresolvedNames[0];
    if (unknownCard !== undefined) {
      logger.error("Decklist card name could not be resolved", {
        cardName: unknownCard,
        fixtureId,
        side,
      });
      throw new Error(
        `Fixture "${fixtureId}" ${side} decklist contains unknown card name "${unknownCard}"`,
      );
    }
  }

  summarizeMultiPrinting(diagnostics);

  logger.info("Finished decklist resolution for fixture", {
    entryCount: diagnostics.parsedEntriesCount,
    expandedDeckCount: cards.length,
    fixtureId,
    side,
    uniqueCardCount,
  });

  return cards;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a fixture from pre-materialized card objects (synchronous).
 *
 * Both playerOne.deck and playerTwo.deck must be card arrays, numbers, or
 * undefined — not deck-list strings. Use createFixtureFromDeckList for the
 * string-deck path.
 */
export const createFixture = (fixture: LorcanaSimulatorFixtureInput): LorcanaSimulatorFixture => {
  logger.info("Creating Lorcana simulator fixture", {
    fixtureId: fixture.id,
    fixtureName: fixture.name,
  });

  if (isStringDeck(fixture.playerOne.deck) || isStringDeck(fixture.playerTwo.deck)) {
    throw new Error(
      `Fixture "${fixture.id}" uses a string deck list. Use createFixtureFromDeckList instead.`,
    );
  }

  logger.debug("Fixture uses pre-materialized deck values (non-string)", {
    fixtureId: fixture.id,
  });

  return fixture as LorcanaSimulatorFixture;
};

/**
 * Create a fixture where one or both decks are specified as deck-list strings
 * (asynchronous — loads the full card pool on first call, then caches it).
 */
export async function createFixtureFromDeckList(
  fixture: LorcanaSimulatorFixtureInput,
): Promise<LorcanaSimulatorFixture> {
  logger.info("Creating Lorcana simulator fixture from deck list", {
    fixtureId: fixture.id,
    fixtureName: fixture.name,
  });

  const playerOneDeckIsString = isStringDeck(fixture.playerOne.deck);
  const playerTwoDeckIsString = isStringDeck(fixture.playerTwo.deck);

  if (playerOneDeckIsString !== playerTwoDeckIsString) {
    logger.error("Fixture uses mixed deck types; both decks must be strings or both non-strings", {
      fixtureId: fixture.id,
      playerOneDeckType: typeof fixture.playerOne.deck,
      playerTwoDeckType: typeof fixture.playerTwo.deck,
    });
    throw new Error(
      `Fixture "${fixture.id}" has mismatched deck input types; both playerOne.deck and playerTwo.deck must be decklist strings or neither`,
    );
  }

  const [playerOneCards, playerTwoCards] = await Promise.all([
    playerOneDeckIsString
      ? parseDeckFromText("playerOne", fixture.id, fixture.playerOne.deck as string)
      : Promise.resolve(fixture.playerOne.deck),
    playerTwoDeckIsString
      ? parseDeckFromText("playerTwo", fixture.id, fixture.playerTwo.deck as string)
      : Promise.resolve(fixture.playerTwo.deck),
  ]);

  const resolvedFixture: LorcanaSimulatorFixture = {
    ...fixture,
    playerOne: { ...fixture.playerOne, deck: playerOneCards } as TestInitialState,
    playerTwo: { ...fixture.playerTwo, deck: playerTwoCards } as TestInitialState,
  };

  logger.info("Finished creating Lorcana simulator fixture", {
    fixtureId: fixture.id,
    playerOneDeckCount:
      typeof resolvedFixture.playerOne.deck === "number"
        ? resolvedFixture.playerOne.deck
        : Array.isArray(resolvedFixture.playerOne.deck)
          ? resolvedFixture.playerOne.deck.length
          : 0,
    playerTwoDeckCount:
      typeof resolvedFixture.playerTwo.deck === "number"
        ? resolvedFixture.playerTwo.deck
        : Array.isArray(resolvedFixture.playerTwo.deck)
          ? resolvedFixture.playerTwo.deck.length
          : 0,
  });

  return resolvedFixture;
}

/**
 * Validate and sanitize a raw deck-list string against the known card pool.
 * Returns the sanitized text (unknown cards stripped) and the list of
 * card names that could not be resolved.
 */
export async function sanitizeDeckText(deckText: string): Promise<{
  sanitizedText: string;
  unknownCards: string[];
}> {
  const allCards = await getCardPool();
  const { resolveLorcanaDeckListTextFromPool } =
    await import("@tcg/lorcana-cards/deck-list-resolver");
  const { diagnostics, entries } = resolveLorcanaDeckListTextFromPool(deckText, allCards);
  const unknownSet = new Set(diagnostics.unresolvedNames);

  const sanitizedText = entries
    .filter((entry) => !unknownSet.has(entry.cardName))
    .map((entry) => `${entry.quantity} ${entry.cardName}`)
    .join("\n");

  return {
    sanitizedText,
    unknownCards: diagnostics.unresolvedNames,
  };
}
