import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { whispersWithin } from "./whispers-within.ts";

export const whispersWithinI18n = defineFamilyI18n(whispersWithin, {
  en: {
    name: "Whispers Within",
    typeText: "Generic Action - Attack",
    text: "When this defends, opt 1.",
  },
});

export const {
  red: whispersWithinRedI18n,
  yellow: whispersWithinYellowI18n,
  blue: whispersWithinBlueI18n,
} = whispersWithinI18n.cards;
