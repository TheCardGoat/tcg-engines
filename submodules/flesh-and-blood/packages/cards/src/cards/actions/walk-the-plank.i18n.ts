import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { walkThePlank } from "./walk-the-plank.ts";

export const walkThePlankI18n = defineFamilyI18n(walkThePlank, {
  en: {
    name: "Walk the Plank",
    text: "When this hits a Pirate hero, {t} them or an ally they control.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: walkThePlankRedI18n,
  yellow: walkThePlankYellowI18n,
  blue: walkThePlankBlueI18n,
} = walkThePlankI18n.cards;
