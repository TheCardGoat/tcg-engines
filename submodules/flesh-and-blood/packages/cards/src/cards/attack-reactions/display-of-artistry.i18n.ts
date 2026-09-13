import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { displayOfArtistry } from "./display-of-artistry.ts";

export const displayOfArtistryI18n = defineFamilyI18n(displayOfArtistry, {
  en: {
    name: "Display of Artistry",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target weapon attack gets +${amount}{p}. If the weapon has been sharpened this turn, the attack gets "Reaction cards get -1{d} while defending this."`,
  },
});

export const {
  red: displayOfArtistryRedI18n,
  yellow: displayOfArtistryYellowI18n,
  blue: displayOfArtistryBlueI18n,
} = displayOfArtistryI18n.cards;
