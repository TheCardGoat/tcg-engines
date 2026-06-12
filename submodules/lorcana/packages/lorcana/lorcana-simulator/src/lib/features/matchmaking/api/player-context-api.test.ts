import { getAllCardsById } from "@tcg/lorcana-cards";
import { aladdinHeroicOutlaw } from "@tcg/lorcana-cards/cards/001";
import { getFullName } from "@tcg/lorcana-types";
import { beforeEach, describe, expect, it, mock } from "bun:test";

const cardsById = await getAllCardsById();
const historicDeckCardEntry = Object.entries(cardsById).find(
  ([, card]) => card.id === aladdinHeroicOutlaw.id,
);

if (!historicDeckCardEntry) {
  throw new Error(`Could not find test card "${aladdinHeroicOutlaw.id}" in Lorcana catalog.`);
}

const [historicDeckCardPublicId] = historicDeckCardEntry;

mock.module("$lib/config/public-url-config.js", () => ({
  getApiOrigin: () => "https://api.example.test",
}));

const {
  fetchDeckListSnapshotByDeckListId,
  fetchMatchmakingEngagementState,
  fetchMatchmakingContext,
  fetchProfileDeckSummaries,
  fetchSelectedProfileDeckSummary,
  importDeckForProfile,
  importLegacyDecksForProfile,
  joinMatchmakingEngagementEvent,
  updateActiveMatchmakingProfile,
  updateProfileSelectedDeck,
} = await import("./player-context-api.js");

describe("player-context-api", () => {
  beforeEach(() => {
    globalThis.fetch = mock() as unknown as typeof fetch;
  });

  it("loads matchmaking context from the auth API", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify({
            account: {
              userId: "user_1",
              name: "Edu",
              email: "edu@example.com",
              image: null,
              username: "edu",
              displayUsername: "This is Edu",
              linkedAccounts: [],
            },
            activeGameProfileId: "gp_1",
            profiles: [],
            engagement: {
              walletBalance: 5,
              featuredEvent: null,
              activeEvents: [],
            },
          }),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchMatchmakingContext();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/users/me/games/lorcana/matchmaking-context",
      { credentials: "include" },
    );
    expect(result.activeGameProfileId).toBe("gp_1");
    expect(result.engagement.walletBalance).toBe(5);
  });

  it("loads and joins engagement events through dedicated endpoints", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify({
            walletBalance: 7,
            featuredEvent: null,
            activeEvents: [],
          }),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await fetchMatchmakingEngagementState();
    await joinMatchmakingEngagementEvent("engevt_1");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.example.test/v1/users/me/games/lorcana/engagement",
      { credentials: "include" },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example.test/v1/users/me/games/lorcana/engagement/events/engevt_1/join",
      {
        method: "POST",
        credentials: "include",
      },
    );
  });

  it("updates active profile and selected deck through dedicated endpoints", async () => {
    const fetchMock = mock(async () => new Response(JSON.stringify({ success: true })));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await updateActiveMatchmakingProfile("gp_2");
    await updateProfileSelectedDeck("gp_2", "deck_2");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.example.test/v1/users/me/games/lorcana/matchmaking-preferences",
      expect.objectContaining({
        method: "PUT",
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example.test/v1/users/me/games/lorcana/profiles/gp_2",
      expect.objectContaining({
        method: "PUT",
      }),
    );
  });

  it("loads deck summaries for a single profile on demand", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify([
            {
              deckId: "deck_1",
              deckName: "Amber Steel",
              activeDeckVersionId: "dv_1",
              activeDeckListId: "dl_1",
              cardCount: 60,
              colorMask: 33,
              updatedAt: "2026-03-03T00:00:00.000Z",
            },
          ]),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchProfileDeckSummaries("gp_2");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/users/me/games/lorcana/profiles/gp_2/decks",
      { credentials: "include" },
    );
    expect(result[0]?.deckId).toBe("deck_1");
  });

  it("loads the selected deck summary for a single profile on demand", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify({
            selectedDeckId: "deck_1",
            selectedDeckSummary: {
              deckId: "deck_1",
              deckName: "Amber Steel",
              activeDeckVersionId: "dv_1",
              activeDeckListId: "dl_1",
              cardCount: 60,
              colorMask: 33,
              updatedAt: "2026-03-03T00:00:00.000Z",
            },
          }),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchSelectedProfileDeckSummary("gp_2");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/users/me/games/lorcana/profiles/gp_2/selected-deck",
      { credentials: "include" },
    );
    expect(result.selectedDeckSummary?.deckId).toBe("deck_1");
  });

  it("imports a deck through the profile-scoped endpoint", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify({
            deckId: "deck_9",
            deckName: "Emerald Steel Tempo",
            activeDeckVersionId: "dv_9",
            activeDeckListId: "dl_9",
          }),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await importDeckForProfile("gp_2", {
      deckName: "Emerald Steel Tempo",
      deckText: "4 Diablo - Devoted Herald",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/users/me/games/lorcana/profiles/gp_2/decks/import",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
    expect(result.deckId).toBe("deck_9");
  });

  it("imports legacy decks for the active profile", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify({
            account: {
              userId: "user_1",
              name: "Edu",
              email: "edu@example.com",
              image: null,
              username: "edu",
              displayUsername: "This is Edu",
              linkedAccounts: [],
            },
            activeGameProfileId: "gp_2",
            profiles: [],
            engagement: {
              walletBalance: 0,
              featuredEvent: null,
              activeEvents: [],
            },
          }),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await importLegacyDecksForProfile("gp_2");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/users/me/games/lorcana/onboard",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ termsAccepted: true, forceReimport: true, gameProfileId: "gp_2" }),
      }),
    );
  });

  it("turns a deck list payload into a historic deck and deck text snapshot", async () => {
    const fetchMock = mock(
      async () =>
        new Response(
          JSON.stringify({
            data: {
              cards: [{ publicId: historicDeckCardPublicId, quantity: 4 }],
            },
          }),
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const snapshot = await fetchDeckListSnapshotByDeckListId("dl_1");

    expect(snapshot.historicDeck).toEqual([
      { cardPublicId: historicDeckCardPublicId, quantity: 4 },
    ]);
    expect(snapshot.deckText).toBe(`4 ${getFullName(aladdinHeroicOutlaw)}`);
  });
});
