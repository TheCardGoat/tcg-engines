import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { smallBlinder } from "./small-blinder.ts";

export const smallBlinderI18n = defineFamilyI18n(smallBlinder, {
  en: {
    name: "Small Blinder",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target sword attack gets +${amount}{p} and wagers with the defending hero. The winner creates a Blade Dance token.`,
  },
});

export const {
  red: smallBlinderRedI18n,
  yellow: smallBlinderYellowI18n,
  blue: smallBlinderBlueI18n,
} = smallBlinderI18n.cards;
