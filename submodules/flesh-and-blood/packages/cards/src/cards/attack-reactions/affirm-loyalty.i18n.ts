import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { affirmLoyalty } from "./affirm-loyalty.ts";

export const affirmLoyaltyI18n = defineFamilyI18n(affirmLoyalty, {
  en: {
    name: "Affirm Loyalty",
    typeText: "Draconic Warrior Attack Reaction",
    text: "Target dagger attack gets +2{p}. If you control 2 or more Draconic chain links, create a Fealty token.",
  },
});

export const { red: affirmLoyaltyRedI18n } = affirmLoyaltyI18n.cards;
