import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { roughUp } from "./rough-up.ts";

export const roughUpI18n = defineFamilyI18n(roughUp, {
  en: {
    name: "Rough Up",
    text: "When this attacks, if there is a card with 6 or more {p} in your pitch zone, this gets +1{p}.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: roughUpRedI18n,
  yellow: roughUpYellowI18n,
  blue: roughUpBlueI18n,
} = roughUpI18n.cards;
