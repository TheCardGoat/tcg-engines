import { apiUrl } from "../../runtime/gameRuntimeApi";
import type { RiftboundClientCardDefinitionV1 } from "./state";

interface RiftboundUiCard {
  canonical_id: string;
  name: string;
  card_type: string;
  domains: string[];
  printings: Array<{ id: string; image_url: string }>;
}

interface RiftboundUiCardsResponse {
  object: "ui-cards";
  data: RiftboundUiCard[];
  pagination: { has_more: boolean };
}

const catalogDefinitionCache: Record<string, RiftboundClientCardDefinitionV1> = {};
let nextCatalogPage = 1;
let catalogExhausted = false;
let catalogPageLoad: Promise<void> | null = null;

export async function fetchRiftboundCardDefinitions(
  cardIds: Iterable<string>,
): Promise<Record<string, RiftboundClientCardDefinitionV1>> {
  const requested = [...new Set(cardIds)];
  while (requested.some((cardId) => !catalogDefinitionCache[cardId]) && !catalogExhausted) {
    catalogPageLoad ??= loadNextRiftboundCatalogPage().finally(() => {
      catalogPageLoad = null;
    });
    await catalogPageLoad;
  }
  const missing = requested.filter((cardId) => !catalogDefinitionCache[cardId]);
  if (missing.length > 0) {
    throw new Error(`Riftbound catalog did not contain ${missing.length} selected cards.`);
  }
  return Object.fromEntries(
    requested.map((cardId) => [cardId, catalogDefinitionCache[cardId]!] as const),
  );
}

async function loadNextRiftboundCatalogPage(): Promise<void> {
  const page = nextCatalogPage;
  const response = await fetch(
    apiUrl("riftbound", `/riftbound/ui/cards?page_size=250&page=${page}`),
  );
  if (!response.ok) {
    throw new Error(`Riftbound catalog request failed with HTTP ${response.status}.`);
  }
  const payload = (await response.json()) as Partial<RiftboundUiCardsResponse>;
  if (
    payload.object !== "ui-cards" ||
    !Array.isArray(payload.data) ||
    typeof payload.pagination?.has_more !== "boolean"
  ) {
    throw new Error("Riftbound catalog response was invalid.");
  }
  for (const card of payload.data) {
    if (
      typeof card?.canonical_id !== "string" ||
      typeof card.name !== "string" ||
      typeof card.card_type !== "string" ||
      !Array.isArray(card.domains) ||
      !Array.isArray(card.printings)
    ) {
      throw new Error("Riftbound catalog contained an invalid card.");
    }
    const base = { name: card.name, cardType: card.card_type, domains: [...card.domains] };
    const firstImageUrl = card.printings[0]?.image_url;
    const definition: RiftboundClientCardDefinitionV1 = {
      ...base,
      ...(firstImageUrl ? { imageUrl: firstImageUrl } : {}),
    };
    catalogDefinitionCache[card.canonical_id] = definition;
    for (const printing of card.printings) {
      if (typeof printing.id !== "string" || typeof printing.image_url !== "string") continue;
      catalogDefinitionCache[printing.id] = { ...base, imageUrl: printing.image_url };
    }
  }
  nextCatalogPage = page + 1;
  catalogExhausted = !payload.pagination.has_more;
}
