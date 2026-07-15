import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

export type AtelierBalance = {
  marks: number;
  earnedToday: number;
  earnedThisWeek: number;
  dailyCapPoints: number | null;
  weeklyCapPoints: number | null;
};

export type AtelierAcquisitionType = "rental" | "permanent";

export type AtelierHolding = {
  id: string;
  canonicalId: string;
  printingShortId: string;
  acquisitionType: AtelierAcquisitionType;
  acquiredAt: string;
  expiresAt: string | null;
  costMarks: number;
  refundedAt: string | null;
  refundMarks: number | null;
  isLive: boolean;
};

export type AtelierLedgerCategory = "earn" | "spend" | "refund" | "adjustment" | "grant";

export type AtelierLedgerEntry = {
  id: string;
  entryType: "credit" | "debit" | "adjustment";
  points: number;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  eventId: string | null;
  createdAt: string;
  category: AtelierLedgerCategory;
};

export type AtelierRarityCode =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "epic"
  | "iconic"
  | "enchanted"
  | "promo"
  | "special";

export type AtelierRarityPricing = {
  rental: number;
  permanent: number;
  refund: number;
};

export type AtelierCatalogPrinting = {
  printingShortId: string;
  set: string;
  cardNumber: number;
  rarity: string;
  specialRarity: string | null;
  rarityCode: AtelierRarityCode;
  prices: AtelierRarityPricing;
  ownedLiveCopies: number;
  isDefault: boolean;
  promotionsApplied: string[];
};

export type AtelierCatalog = {
  canonicalId: string;
  printings: AtelierCatalogPrinting[];
  rentalDays: number;
  sellBackEnabled: boolean;
  appliedPromotionIds: string[];
};

export type AtelierPromotion = {
  eventId: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  earnMultiplier: number | null;
  earnMultiplierByAction: Record<string, number> | null;
  pricingMultiplier: number | null;
  scope: { canonicalIds?: string[]; setCodes?: string[] } | null;
};

export async function fetchAtelierBalance(gameSlug: string): Promise<AtelierBalance> {
  return requestJson<AtelierBalance>(
    `${getApiOrigin()}/v1/atelier/balance?gameSlug=${encodeURIComponent(gameSlug)}`,
  );
}

export async function fetchAtelierLedger(params: {
  cursor?: string | null;
  limit?: number;
}): Promise<{ entries: AtelierLedgerEntry[]; nextCursor: string | null }> {
  const url = new URL(`${getApiOrigin()}/v1/atelier/ledger`);
  if (params.cursor) url.searchParams.set("cursor", params.cursor);
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  return requestJson(url.toString());
}

export async function fetchAtelierHoldings(includeHistory: boolean = false): Promise<{
  holdings: AtelierHolding[];
}> {
  const url = new URL(`${getApiOrigin()}/v1/atelier/holdings`);
  if (includeHistory) url.searchParams.set("includeHistory", "true");
  return requestJson(url.toString());
}

export async function fetchAtelierCatalog(params: {
  gameSlug: string;
  canonicalId: string;
}): Promise<AtelierCatalog> {
  const url = new URL(`${getApiOrigin()}/v1/atelier/catalog`);
  url.searchParams.set("gameSlug", params.gameSlug);
  url.searchParams.set("canonicalId", params.canonicalId);
  return requestJson(url.toString());
}

export async function purchaseAtelierHolding(params: {
  gameSlug: string;
  gameProfileId: string;
  printingShortId: string;
  sku: AtelierAcquisitionType;
}): Promise<{ holding: AtelierHolding }> {
  return requestJson(`${getApiOrigin()}/v1/atelier/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export async function sellBackAtelierHolding(holdingId: string): Promise<{
  holding: AtelierHolding;
  refundMarks: number;
}> {
  return requestJson(`${getApiOrigin()}/v1/atelier/sell-back`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ holdingId }),
  });
}

export async function fetchAtelierPromotions(gameSlug: string): Promise<{
  promotions: AtelierPromotion[];
}> {
  return requestJson(
    `${getApiOrigin()}/v1/atelier/promotions?gameSlug=${encodeURIComponent(gameSlug)}`,
  );
}

export async function fetchDeckVersionArtSelections(deckVersionId: string): Promise<{
  deckVersionId: string;
  artSelections: Record<string, string> | null;
}> {
  return requestJson(
    `${getApiOrigin()}/v1/atelier/deck-versions/${encodeURIComponent(deckVersionId)}/art-selections`,
  );
}

export async function saveDeckVersionArtSelections(params: {
  deckVersionId: string;
  artSelections: Record<string, string> | null;
}): Promise<{
  deckVersionId: string;
  artSelections: Record<string, string> | null;
}> {
  return requestJson(
    `${getApiOrigin()}/v1/atelier/deck-versions/${encodeURIComponent(params.deckVersionId)}/art-selections`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artSelections: params.artSelections }),
    },
  );
}
