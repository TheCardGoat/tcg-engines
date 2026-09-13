import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gravekeeping } from "./gravekeeping.ts";

export const gravekeepingI18n = defineFamilyI18n(gravekeeping, {
  en: {
    name: "Gravekeeping",
    typeText: "Generic Action - Attack",
    text: "When this attacks a hero, you may banish a card from their graveyard.",
  },
});

export const {
  red: gravekeepingRedI18n,
  yellow: gravekeepingYellowI18n,
  blue: gravekeepingBlueI18n,
} = gravekeepingI18n.cards;
