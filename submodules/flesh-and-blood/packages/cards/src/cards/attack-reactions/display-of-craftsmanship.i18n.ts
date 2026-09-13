import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { displayOfCraftsmanship } from "./display-of-craftsmanship.ts";

export const displayOfCraftsmanshipI18n = defineFamilyI18n(displayOfCraftsmanship, {
  en: {
    name: "Display of Craftsmanship",
    text: (amount) =>
      `Target weapon attack gets +${amount}{p}. If the weapon has been sharpened this turn, put a +1{p} counter on it.`,
    typeText: "Warrior Attack Reaction",
  },
});

export const {
  red: displayOfCraftsmanshipRedI18n,
  yellow: displayOfCraftsmanshipYellowI18n,
  blue: displayOfCraftsmanshipBlueI18n,
} = displayOfCraftsmanshipI18n.cards;
