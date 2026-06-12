import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { type LorcanaProjectedCard, type PlayerId } from "./types";
import { createCardI18n } from "./card-i18n";

export const FALLBACK_LORCANA_CARD: LorcanaCardDefinition = {
  id: "fallback-card",
  canonicalId: "ci_fallback-card",
  name: "Unknown Card",
  fullName: "Unknown Card",
  cardType: "item",
  inkType: [],
  cost: 0,
  inkable: false,
  abilities: [],
  text: "Fallback card used when a card definition cannot be resolved.",
  i18n: createCardI18n("Unknown Card", {
    en: {
      name: "Unknown Card",
      text: "Fallback card used when a card definition cannot be resolved.",
    },
  }),
  set: "UNKNOWN",
  cardNumber: 0,
};

export const FALLBACK_LORCANA_PROJECTED_CARD: LorcanaProjectedCard = {
  id: "fallback",
  ownerId: "no-one" as PlayerId,
  zone: "limbo",
  definitionId: FALLBACK_LORCANA_CARD.id,
};
