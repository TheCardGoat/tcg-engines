import { describe, expect, it } from "vite-plus/test";
import {
  defaultCyberpunkPrintingId,
  getMergedCyberpunkCards,
  getMergedCyberpunkCardsById,
} from "@tcg/cyberpunk-cards";
import { cyberpunkServerAdapter } from "./adapter.js";
import { cyberpunkCreateServerEngine } from "./cyberpunk-engine-lifecycle.js";

/**
 * Regression coverage for the live-lobby deck-corruption report (F9): a stored
 * pre-Night-City deck version (identity v3 rows: cardId/canonicalId/printingId
 * captured at save time) must resolve into engine instances 1:1 — the dealt
 * cards' slugs must equal the stored slugs with no substitutions — and an
 * unknown stored slug must be refused loudly instead of silently collapsing to
 * an arbitrary catalog card.
 */

const PRE_NIGHT_CITY_MAIN_SLUGS = [
  "afterparty-at-lizzie-s",
  "kiroshi-optics",
  "floor-it",
  "animals-wrecker",
];

function buildStoredDeck(): Array<{ slug: string; printingId: string }> {
  const merged = getMergedCyberpunkCards();
  const legends = merged.filter((card) => card.type === "legend").slice(0, 3);
  expect(legends).toHaveLength(3);

  const namedMains = PRE_NIGHT_CITY_MAIN_SLUGS.map((slug) => {
    const card = getMergedCyberpunkCardsById().get(slug);
    expect(card, `catalog must still contain ${slug}`).toBeDefined();
    expect(card?.type).not.toBe("legend");
    return card!;
  });
  const fillerMains = merged
    .filter((card) => card.type !== "legend")
    .filter((card) => !PRE_NIGHT_CITY_MAIN_SLUGS.includes(card.slug))
    .slice(0, 40 - namedMains.length);

  return [...legends, ...namedMains, ...fillerMains].map((card) => ({
    slug: card.slug,
    // Stored deck versions capture the save-time default printing per slug.
    printingId: defaultCyberpunkPrintingId(card.slug)!,
  }));
}

describe("stored deck version -> engine resolution", () => {
  it("deals every stored slug 1:1 with no substitutions", async () => {
    const stored = buildStoredDeck();
    expect(stored).toHaveLength(43); // 3 legends + 40 distinct mains

    const owner = "profile-f9player-0001-0002-0003-000000000001";
    const rival = "profile-f9rival-0001-0002-0003-000000000002";
    const decks = [owner, rival].map((playerId) => ({
      owner: playerId,
      deck: stored.map((entry) => ({ cardId: entry.slug, qty: 1 })),
    }));
    const cardsMaps = cyberpunkServerAdapter.buildCardInstances(decks);

    const engine = await cyberpunkCreateServerEngine({
      gameSlug: "cyberpunk",
      seed: "stored-deck-resolution",
      player1Id: owner,
      player2Id: rival,
      cardsMaps,
      matchID: "stored-deck-resolution",
    } as never);

    const state = (
      engine as unknown as {
        getState(): {
          G: {
            players: Record<string, { zones: { legendArea: string[]; deck: string[] } }>;
            cardIndex: Record<string, { definitionId: string; zone: string }>;
          };
        };
      }
    ).getState();

    const dealtSlugsFor = (playerId: string): string[] => {
      const player = state.G.players[playerId]!;
      return [...player.zones.legendArea, ...player.zones.deck].map(
        (instanceId) =>
          getMergedCyberpunkCardsById().get(state.G.cardIndex[instanceId]!.definitionId)!.slug,
      );
    };

    for (const playerId of [owner, rival]) {
      const dealtSlugs = dealtSlugsFor(playerId).sort();
      const storedSlugs = stored.map((entry) => entry.slug).sort();
      expect(dealtSlugs).toEqual(storedSlugs);
      // 43 distinct slugs dealt for 43 distinct stored slugs: substitutions
      // (e.g. several entries collapsing onto one card) are impossible.
      expect(new Set(dealtSlugs).size).toBe(43);
    }
  });

  it("projects the seated player's real opening hand before mulligan", async () => {
    const stored = buildStoredDeck();
    const owner = "profile-opening-hand-owner";
    const rival = "profile-opening-hand-rival";
    const cardsMaps = cyberpunkServerAdapter.buildCardInstances(
      [owner, rival].map((playerId) => ({
        owner: playerId,
        deck: stored.map((entry) => ({ cardId: entry.slug, qty: 1 })),
      })),
    );
    const engine = await cyberpunkCreateServerEngine({
      gameSlug: "cyberpunk",
      seed: "opening-hand-projection",
      player1Id: owner,
      player2Id: rival,
      cardsMaps,
      matchID: "opening-hand-projection",
    } as never);

    const chooser = engine.getActivePlayerId();
    if (!chooser) throw new Error("opening-hand setup must nominate a first-player chooser");
    const setup = engine.dispatch(
      "resolveFirstPlayer",
      chooser,
      { goFirst: true },
      { gameId: "opening-hand-projection", sourceAuthority: "server" },
    );
    expect(setup.success).toBe(true);

    const view = engine.getViewerState?.({ role: "player", actorId: owner }) as {
      players: Record<
        string,
        { zones: { hand: Array<{ definitionId: string; faceDown: boolean }> | number } }
      >;
    };
    const ownHand = view.players[owner]?.zones.hand;

    expect(Array.isArray(ownHand)).toBe(true);
    if (!Array.isArray(ownHand)) return;
    expect(ownHand).toHaveLength(6);
    expect(ownHand.every((card) => card.definitionId.length > 0 && !card.faceDown)).toBe(true);
    expect(new Set(ownHand.map((card) => card.definitionId)).size).toBeGreaterThan(1);
    expect(typeof view.players[rival]?.zones.hand).toBe("number");
  });

  it("refuses an unknown stored slug instead of substituting a catalog card", async () => {
    const validation = cyberpunkServerAdapter.validateDeckForFormat("alpha", [
      { cardId: "afterparty-at-lizzie-s", quantity: 1 },
      { cardId: "definitely-not-a-cyberpunk-card", quantity: 2 },
    ]);
    expect(validation.valid).toBe(false);
    expect(validation.rules).toContainEqual(
      expect.objectContaining({
        kind: "card-pool",
        passed: false,
        details: { cardIds: ["definitely-not-a-cyberpunk-card"] },
      }),
    );

    const owner = "profile-f9player-0001-0002-0003-000000000001";
    const rival = "profile-f9rival-0001-0002-0003-000000000002";
    const cardsMaps = cyberpunkServerAdapter.buildCardInstances([
      { owner, deck: [{ cardId: "definitely-not-a-cyberpunk-card", qty: 1 }] },
      { owner: rival, deck: [{ cardId: "afterparty-at-lizzie-s", qty: 1 }] },
    ]);

    await expect(
      cyberpunkCreateServerEngine({
        gameSlug: "cyberpunk",
        seed: "unknown-slug",
        player1Id: owner,
        player2Id: rival,
        cardsMaps,
        matchID: "unknown-slug",
      } as never),
    ).rejects.toThrow(/definitely-not-a-cyberpunk-card/);
  });
});
