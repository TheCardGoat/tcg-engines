import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { droneOfBrutality } from "./drone-of-brutality.ts";

export const droneOfBrutalityI18n = defineFamilyI18n(droneOfBrutality, {
  en: {
    name: "Drone of Brutality",
    text: "If Drone of Brutality would be put into your graveyard from anywhere, instead put it on the bottom of your deck.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: droneOfBrutalityRedI18n,
  yellow: droneOfBrutalityYellowI18n,
  blue: droneOfBrutalityBlueI18n,
} = droneOfBrutalityI18n.cards;
