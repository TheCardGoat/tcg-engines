import { getAllCardsById } from "@tcg/lorcana-cards";
import {
  getFullName,
  LORCANA_FORMATS,
  validateDeckForFormat,
  type CardFormatData,
  type DeckCard,
  type DeckFormatResult,
  type LorcanaFormatId,
  type LorcanaSetCode,
} from "@tcg/lorcana-types";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson, requestVoid } from "$lib/data/transport/http-client.js";
import type { HistoricDeckEntry } from "@/features/practice-match/practice-match-api.js";

type DeckBreakdownCardType = "character" | "action" | "item" | "location";
type DeckBreakdownInkType = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";

export interface MatchmakingLinkedAccount {
  providerId: string;
  accountId: string;
}

export interface MatchmakingAccountContext {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  username: string | null;
  displayUsername: string | null;
  linkedAccounts: MatchmakingLinkedAccount[];
}

export interface ProfileDeckSummary {
  deckId: string;
  deckName: string;
  activeDeckVersionId: string;
  activeDeckListId: string;
  cardCount: number;
  colorMask: number;
  updatedAt: string;
  validFormats: LorcanaFormatId[];
}

export interface ProfileMatchmakingContext {
  gameProfileId: string;
  displayName: string | null;
  selectedDeckId: string | null;
  selectedDeckSummary: ProfileDeckSummary | null;
  decks: ProfileDeckSummary[] | null;
}

export interface DailyStreakSummary {
  currentStreak: number;
  multiplier: number;
  nextTier: { days: number; multiplier: number } | null;
}

export interface MatchmakingContext {
  account: MatchmakingAccountContext;
  activeGameProfileId: string | null;
  profiles: ProfileMatchmakingContext[];
  engagement: MatchmakingEngagementState;
  dailyStreak: DailyStreakSummary;
}

export interface MatchmakingEngagementRewardPreview {
  rewardId: string;
  title: string;
  description: string | null;
  type: string;
  pointsCost: number | null;
}

export interface MatchmakingEngagementRecentOutcome {
  rewardTitle: string | null;
  winnerDisplayName: string | null;
  winnerUserId: string | null;
  awardedAt: string;
  status: string;
}

export interface MatchmakingEngagementEventSummary {
  eventId: string;
  title: string;
  description: string | null;
  rewardType: string;
  featured: boolean;
  joined: boolean;
  canJoin: boolean;
  rulesUrl: string | null;
  startsAt: string;
  endsAt: string;
  eligibleMatchTypes: string[];
  eligibleModes: string[];
  pointsEarned: number;
  dailyPoints: number;
  dailyCapPoints: number | null;
  weeklyPoints: number;
  weeklyCapPoints: number | null;
  eventCapPoints: number | null;
  remainingDailyPoints: number | null;
  remainingWeeklyPoints: number | null;
  remainingEventPoints: number | null;
  nextRewardPreview: MatchmakingEngagementRewardPreview | null;
  recentOutcome: MatchmakingEngagementRecentOutcome | null;
  hasCurrentUserWon: boolean;
}

export interface MatchmakingEngagementState {
  walletBalance: number;
  featuredEvent: MatchmakingEngagementEventSummary | null;
  activeEvents: MatchmakingEngagementEventSummary[];
}

export interface SelectedProfileDeckSummary {
  selectedDeckId: string | null;
  selectedDeckSummary: ProfileDeckSummary | null;
}

interface DeckListDetailResponse {
  data: {
    cards: Array<{
      publicId: string;
      quantity: number;
    }>;
  };
}

export interface DeckListSnapshot {
  historicDeck: HistoricDeckEntry[];
  deckText: string;
}

export interface DeckListBreakdown {
  cardCount: number;
  inkableCount: number;
  uninkableCount: number;
  colorBreakdown: Array<{
    ink: DeckBreakdownInkType;
    count: number;
  }>;
  typeBreakdown: Array<{
    type: DeckBreakdownCardType;
    count: number;
  }>;
}

export interface ImportedProfileDeck {
  deckId: string;
  deckName: string;
  activeDeckVersionId: string;
  activeDeckListId: string;
}

async function fetchDeckListDetailResponse(deckListId: string): Promise<DeckListDetailResponse> {
  return requestJson<DeckListDetailResponse>(
    `${getApiOrigin()}/v1/deck-lists/${deckListId}`,
    undefined,
    "Failed to load deck list",
  );
}

export async function fetchMatchmakingContext(): Promise<MatchmakingContext> {
  return requestJson<MatchmakingContext>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/matchmaking-context`,
    undefined,
    "Failed to load matchmaking context",
  );
}

export async function fetchMatchmakingEngagementState(): Promise<MatchmakingEngagementState> {
  return requestJson<MatchmakingEngagementState>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/engagement`,
    undefined,
    "Failed to load engagement state",
  );
}

export async function joinMatchmakingEngagementEvent(
  eventId: string,
): Promise<MatchmakingEngagementState> {
  return requestJson<MatchmakingEngagementState>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/engagement/events/${eventId}/join`,
    {
      method: "POST",
    },
    "Failed to join engagement event",
  );
}

export async function fetchProfileDeckSummaries(
  gameProfileId: string,
): Promise<ProfileDeckSummary[]> {
  return requestJson<ProfileDeckSummary[]>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/decks`,
    undefined,
    "Failed to load decks",
  );
}

export async function fetchSelectedProfileDeckSummary(
  gameProfileId: string,
): Promise<SelectedProfileDeckSummary> {
  return requestJson<SelectedProfileDeckSummary>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/selected-deck`,
    undefined,
    "Failed to load selected deck",
  );
}

export async function updateActiveMatchmakingProfile(activeGameProfileId: string): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/users/me/games/lorcana/matchmaking-preferences`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeGameProfileId }),
    },
    "Failed to save matchmaking preferences",
  );
}

export async function updateProfileSelectedDeck(
  gameProfileId: string,
  selectedDeckId: string,
): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedDeckId }),
    },
    "Failed to save selected deck",
  );
}

export async function onboardPlayer(): Promise<MatchmakingContext> {
  return requestJson<MatchmakingContext>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/onboard`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termsAccepted: true }),
    },
    "Failed to create your profile",
  );
}

export async function importLegacyDecksForProfile(
  gameProfileId: string,
): Promise<MatchmakingContext> {
  return requestJson<MatchmakingContext>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/onboard`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termsAccepted: true, forceReimport: true, gameProfileId }),
    },
    "Failed to import legacy decks",
  );
}

export async function deleteDeckForProfile(gameProfileId: string, deckId: string): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/decks/${deckId}`,
    {
      method: "DELETE",
    },
    "Failed to delete deck",
  );
}

export async function createDeckForProfile(
  gameProfileId: string,
  body: { deckName: string },
): Promise<ImportedProfileDeck> {
  return requestJson<ImportedProfileDeck>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/decks/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    "Failed to create deck",
  );
}

export async function importDeckForProfile(
  gameProfileId: string,
  body: {
    deckName: string;
    deckText: string;
  },
): Promise<ImportedProfileDeck> {
  return requestJson<ImportedProfileDeck>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/decks/import`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    "Failed to import deck",
  );
}

export async function updateDeckForProfile(
  gameProfileId: string,
  deckId: string,
  body: {
    deckName: string;
    deckText: string;
  },
): Promise<ImportedProfileDeck> {
  return requestJson<ImportedProfileDeck>(
    `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/decks/${deckId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    "Failed to update deck",
  );
}

export async function fetchDeckListSnapshotByDeckListId(
  deckListId: string,
): Promise<DeckListSnapshot> {
  const payload = await fetchDeckListDetailResponse(deckListId);
  const historicDeck = payload.data.cards.map((card) => ({
    cardPublicId: card.publicId,
    quantity: card.quantity,
  }));
  const cardsById = await getAllCardsById();
  const deckText = payload.data.cards
    .map((card) => {
      const cardDefinition = cardsById[card.publicId];
      const displayName = cardDefinition ? getFullName(cardDefinition) : card.publicId;
      return `${card.quantity} ${displayName}`;
    })
    .join("\n");

  return {
    historicDeck,
    deckText,
  };
}

export async function fetchDeckListBreakdownByDeckListId(
  deckListId: string,
): Promise<DeckListBreakdown> {
  const payload = await fetchDeckListDetailResponse(deckListId);
  const cardsById = await getAllCardsById();
  const colorBreakdown = new Map<DeckBreakdownInkType, number>();
  const typeBreakdown = new Map<DeckBreakdownCardType, number>();

  let cardCount = 0;
  let inkableCount = 0;
  let uninkableCount = 0;

  for (const card of payload.data.cards) {
    cardCount += card.quantity;

    const cardDefinition = cardsById[card.publicId];
    if (!cardDefinition) {
      continue;
    }

    if (cardDefinition.inkable) {
      inkableCount += card.quantity;
    } else {
      uninkableCount += card.quantity;
    }

    const inks = Array.isArray(cardDefinition.inkType)
      ? cardDefinition.inkType
      : [cardDefinition.inkType];
    for (const ink of inks) {
      colorBreakdown.set(ink, (colorBreakdown.get(ink) ?? 0) + card.quantity);
    }

    typeBreakdown.set(
      cardDefinition.cardType,
      (typeBreakdown.get(cardDefinition.cardType) ?? 0) + card.quantity,
    );
  }

  const orderedInks: DeckBreakdownInkType[] = [
    "amber",
    "amethyst",
    "emerald",
    "ruby",
    "sapphire",
    "steel",
  ];
  const orderedTypes: DeckBreakdownCardType[] = ["character", "action", "item", "location"];

  return {
    cardCount,
    inkableCount,
    uninkableCount,
    colorBreakdown: orderedInks
      .map((ink) => ({ ink, count: colorBreakdown.get(ink) ?? 0 }))
      .filter((entry) => entry.count > 0),
    typeBreakdown: orderedTypes
      .map((type) => ({ type, count: typeBreakdown.get(type) ?? 0 }))
      .filter((entry) => entry.count > 0),
  };
}

export async function fetchHistoricDeckByDeckListId(
  deckListId: string,
): Promise<HistoricDeckEntry[]> {
  const snapshot = await fetchDeckListSnapshotByDeckListId(deckListId);
  return snapshot.historicDeck;
}

// ---------------------------------------------------------------------------
// Client-side deck format validation
// ---------------------------------------------------------------------------

// Mirrors deriveCardCopyLimit in @tcg/lorcana-cards/scripts/generators/file-generator.
// Kept here because generated package card data doesn't carry cardCopyLimit; we derive
// it from rulesText at lookup time so reprints/enchanted variants resolve identically.
function deriveCardCopyLimit(rulesText?: string): number | "no-limit" | undefined {
  if (!rulesText) return undefined;
  if (/you may have any number of cards named\b/i.test(rulesText)) return "no-limit";
  const upTo = rulesText.match(/you may have up to (\d+) copies of\b/i);
  if (upTo) return Number.parseInt(upTo[1], 10);
  const only = rulesText.match(/you may only have (\d+) cop(?:y|ies) of\b/i);
  if (only) return Number.parseInt(only[1], 10);
  return undefined;
}

let cachedLookup: ((shortId: string) => CardFormatData | undefined) | null = null;
let lookupPromise: Promise<(shortId: string) => CardFormatData | undefined> | null = null;

async function buildClientCardFormatLookup(): Promise<
  (shortId: string) => CardFormatData | undefined
> {
  if (cachedLookup) return cachedLookup;
  if (lookupPromise) return lookupPromise;

  lookupPromise = import("@tcg/lorcana-cards/data").then(
    ({ canonicalCards, cardsAuxKv, printings, sets }) => {
      const setCodeById: Record<string, string> = {};
      for (const [id, set] of Object.entries(sets)) {
        setCodeById[id] = set.code;
      }

      // Derive a display name from a CanonicalCard (avoids type mismatch with getFullName).
      const cardFullName = (c: { fullName?: string; name: string; version?: string }): string =>
        c.fullName ?? (c.version ? `${c.name} - ${c.version}` : c.name);

      // Pre-compute name → shortId[] index for the name-based fallback.
      const shortIdsByFullName: Record<string, string[]> = {};
      for (const [sid, c] of Object.entries(canonicalCards)) {
        const fn = cardFullName(c).toLowerCase();
        (shortIdsByFullName[fn] ??= []).push(sid);
      }

      const collectSetCodes = (pids: string[]): Set<string> => {
        const codes = new Set<string>();
        for (const pid of pids) {
          const setId = printings[pid]?.set;
          if (setId) {
            const code = setCodeById[setId];
            if (code) codes.add(code);
          }
        }
        return codes;
      };

      cachedLookup = (shortId: string): CardFormatData | undefined => {
        const card = canonicalCards[shortId];
        if (!card) return undefined;

        const printingIds = cardsAuxKv.printingIdsByCanonicalId[card.canonicalId] ?? [];

        // Primary: sets from the canonical grouping.
        const setCodes = collectSetCodes(printingIds);

        // Name-based fallback: include sets from sibling shortIds (same full name,
        // possibly different canonicalId due to stale data).
        const fn = cardFullName(card).toLowerCase();
        const siblings = shortIdsByFullName[fn] ?? [];
        const allPrintingIds = [...printingIds];
        for (const sibId of siblings) {
          if (sibId === shortId) continue;
          const sibCard = canonicalCards[sibId];
          if (!sibCard) continue;
          const sibPrintings = cardsAuxKv.printingIdsByCanonicalId[sibCard.canonicalId] ?? [];
          for (const code of collectSetCodes(sibPrintings)) {
            setCodes.add(code);
          }
          allPrintingIds.push(...sibPrintings);
        }

        // Rotation states from all printings (primary + siblings).
        const rotationStates = [
          ...new Set(
            allPrintingIds
              .map((pid) => printings[pid]?.setRotationState)
              .filter((rs): rs is string => Boolean(rs)),
          ),
        ];

        return {
          canonicalId: card.canonicalId,
          fullName: cardFullName(card),
          inkTypes: Array.isArray(card.inkType) ? card.inkType : [card.inkType],
          sets: [...setCodes] as LorcanaSetCode[],
          rotationStates,
          cardCopyLimit: deriveCardCopyLimit(card.rulesText),
        };
      };

      return cachedLookup;
    },
  );

  return lookupPromise;
}

export async function fetchDeckValidationForFormat(
  deckListId: string,
  formatId: LorcanaFormatId,
): Promise<DeckFormatResult> {
  const format = LORCANA_FORMATS[formatId];
  if (!format) {
    return { formatId, valid: false, rules: [] };
  }

  const payload = await fetchDeckListDetailResponse(deckListId);
  const deckCards: DeckCard[] = payload.data.cards.map((card) => ({
    cardId: card.publicId,
    quantity: card.quantity,
  }));

  const lookup = await buildClientCardFormatLookup();
  return validateDeckForFormat(deckCards, lookup, format);
}
