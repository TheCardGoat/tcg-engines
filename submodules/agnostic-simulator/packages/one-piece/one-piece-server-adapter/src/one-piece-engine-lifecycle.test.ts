import { describe, expect, it } from "vite-plus/test";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { onePieceCreateServerEngine } from "./one-piece-engine-lifecycle.js";
import { OnePieceServerEngine } from "./one-piece-server-engine.js";
import { onePieceServerAdapter } from "./adapter.js";
import { onePieceDeckInterchangeAdapter } from "./deck-interchange.js";

// PRB01-001 (Sanji) is a leader card; the engine test fixtures use it.
const LEADER_ID = "PRB01-001";
// A canonical character card present in the card pool. The test only needs
// hasCard(id) to return true and cardType !== "leader" && !== "don".
const MAIN_CARD_ID = "ST04-003";
const DON_ID = "DON-001";
const MAIN_DECK_SIZE = 50;
const DON_DECK_SIZE = 10;

/**
 * Section-tagged cardsMaps, mirroring what the platform produces when a One
 * Piece V2 deck version is projected from its native leader/main/don sections.
 */
function sectionedCardsMaps(playerIds: readonly string[]): CardsMaps {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};
  const instanceSections: Record<string, string> = {};
  for (const playerId of playerIds) {
    const instanceIds: string[] = [];
    const leaderInstance = `${playerId}_leader_0`;
    cardInstances[leaderInstance] = LEADER_ID;
    instanceSections[leaderInstance] = "leader";
    instanceIds.push(leaderInstance);
    for (let i = 0; i < MAIN_DECK_SIZE; i++) {
      const instanceId = `${playerId}_main_${i}`;
      cardInstances[instanceId] = MAIN_CARD_ID;
      instanceSections[instanceId] = "main";
      instanceIds.push(instanceId);
    }
    for (let i = 0; i < DON_DECK_SIZE; i++) {
      const instanceId = `${playerId}_don_${i}`;
      cardInstances[instanceId] = DON_ID;
      instanceSections[instanceId] = "don";
      instanceIds.push(instanceId);
    }
    owners[playerId] = instanceIds;
  }
  return { cardInstances, owners, instanceSections };
}

/** Legacy untagged cardsMaps — exercises the catalog-type fallback. */
function legacyCardsMaps(playerIds: readonly string[]): CardsMaps {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};
  for (const playerId of playerIds) {
    const instanceIds: string[] = [];
    cardInstances[`${playerId}_leader_0`] = LEADER_ID;
    instanceIds.push(`${playerId}_leader_0`);
    for (let i = 0; i < MAIN_DECK_SIZE; i++) {
      const instanceId = `${playerId}_main_${i}`;
      cardInstances[instanceId] = MAIN_CARD_ID;
      instanceIds.push(instanceId);
    }
    for (let i = 0; i < DON_DECK_SIZE; i++) {
      const instanceId = `${playerId}_don_${i}`;
      cardInstances[instanceId] = DON_ID;
      instanceIds.push(instanceId);
    }
    owners[playerId] = instanceIds;
  }
  return { cardInstances, owners };
}

describe("onePieceCreateServerEngine — section-tagged decks", () => {
  it("creates a match from the authoritative One Piece document topology", async () => {
    const document = onePieceDeckInterchangeAdapter.createDocument({
      sections: {
        leader: [{ canonicalId: LEADER_ID, quantity: 1 }],
        main: [{ canonicalId: MAIN_CARD_ID, quantity: MAIN_DECK_SIZE }],
        don: [{ canonicalId: DON_ID, quantity: DON_DECK_SIZE }],
      },
    });
    const projected = onePieceDeckInterchangeAdapter.projectDocument(document, {
      role: "runtime",
    });
    expect(projected.diagnostics).toEqual([]);
    expect(projected.deck[0]?.sectionId).toBe("leader");
    const deck = projected.deck.map((entry) => ({
      cardId: entry.cardId,
      qty: entry.quantity,
      sectionId: entry.sectionId,
    }));
    const cardsMaps = onePieceServerAdapter.buildCardInstances([
      { owner: "p1", deck },
      { owner: "p2", deck },
    ]);

    const engine = await onePieceCreateServerEngine({
      gameSlug: "one-piece",
      seed: "seed-document-backed",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    });

    expect(engine).toBeInstanceOf(OnePieceServerEngine);
  });

  it("routes leader to leaderCardId, main to mainDeck, and DON!! to donDeckCount via section tags", async () => {
    const engine = await onePieceCreateServerEngine({
      gameSlug: "one-piece",
      seed: "seed-sectioned-don",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: sectionedCardsMaps(["p1", "p2"]),
    });

    expect(engine).toBeInstanceOf(OnePieceServerEngine);
    const state = (engine as OnePieceServerEngine).state;

    for (const seat of ["south", "north"] as const) {
      const player = state.players[seat];
      expect(player).toBeTruthy();
      expect(player!.leaderCardId).toBe(LEADER_ID);
      // createMatch draws a 5-card opening hand from the main deck, so the
      // remaining deck + hand together hold the 50 classified main cards.
      // Deck entries are engine instance ids, not card ids.
      expect(player!.deck.length + player!.hand.length).toBe(MAIN_DECK_SIZE);
      expect(player!.hand).toHaveLength(5);
      expect(player!.donDeckCount).toBe(DON_DECK_SIZE);
    }
  });
});

describe("onePieceCreateServerEngine — legacy untagged decks", () => {
  it("classifies leader/main/DON!! through the catalog-type fallback", async () => {
    const engine = await onePieceCreateServerEngine({
      gameSlug: "one-piece",
      seed: "seed-legacy-don",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: legacyCardsMaps(["p1", "p2"]),
    });

    const state = (engine as OnePieceServerEngine).state;
    for (const seat of ["south", "north"] as const) {
      const player = state.players[seat];
      expect(player).toBeTruthy();
      expect(player!.leaderCardId).toBe(LEADER_ID);
      expect(player!.deck.length + player!.hand.length).toBe(MAIN_DECK_SIZE);
      expect(player!.donDeckCount).toBe(DON_DECK_SIZE);
    }
  });

  it("throws when a deck has no leader card", async () => {
    const cardsMaps: CardsMaps = {
      cardInstances: { p1_main_0: MAIN_CARD_ID },
      owners: { p1: ["p1_main_0"], p2: ["p2_main_0"] },
      instanceSections: { p1_main_0: "main", p2_main_0: "main" },
    };
    (cardsMaps as { cardInstances: Record<string, string> }).cardInstances["p2_main_0"] =
      MAIN_CARD_ID;

    await expect(
      onePieceCreateServerEngine({
        gameSlug: "one-piece",
        seed: "seed-no-leader",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps,
      }),
    ).rejects.toThrow(/does not contain a leader card/);
  });
});

describe("onePieceCreateServerEngine — fail-closed section routing", () => {
  it("throws when a section-tagged cardsMaps has instances with no resolvable section", async () => {
    // Both players have a leader + main, but p2 has one DON!! card tagged with
    // a foreign section ("resource" — a Gundam section, not a One Piece one).
    const cardsMaps: CardsMaps = {
      cardInstances: {
        p1_leader_0: LEADER_ID,
        p1_main_0: MAIN_CARD_ID,
        p1_don_0: DON_ID,
        p2_leader_0: LEADER_ID,
        p2_main_0: MAIN_CARD_ID,
        p2_don_0: DON_ID,
      },
      owners: {
        p1: ["p1_leader_0", "p1_main_0", "p1_don_0"],
        p2: ["p2_leader_0", "p2_main_0", "p2_don_0"],
      },
      instanceSections: {
        p1_leader_0: "leader",
        p1_main_0: "main",
        p1_don_0: "don",
        p2_leader_0: "leader",
        p2_main_0: "main",
        p2_don_0: "resource",
      },
    };

    await expect(
      onePieceCreateServerEngine({
        gameSlug: "one-piece",
        seed: "seed-unresolved",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps,
      }),
    ).rejects.toThrow(/without a resolvable deck section/);
  });
});
