import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { highPitchedHowl } from "./high-pitched-howl.ts";

export const highPitchedHowlI18n = defineFamilyI18n(highPitchedHowl, {
  en: {
    name: "High Pitched Howl",
    text: "When this attacks, if there is a card with 6 or more {p} in your pitch zone, create a Vigor token.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: highPitchedHowlRedI18n,
  yellow: highPitchedHowlYellowI18n,
  blue: highPitchedHowlBlueI18n,
} = highPitchedHowlI18n.cards;
