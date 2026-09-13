import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bigBlinder } from "./big-blinder.ts";

export const bigBlinderI18n = defineFamilyI18n(bigBlinder, {
  en: {
    name: "Big Blinder",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target sword attack gets +${amount}{p} and wagers with the defending hero. The winner creates a Flurry token.`,
  },
});

export const {
  red: bigBlinderRedI18n,
  yellow: bigBlinderYellowI18n,
  blue: bigBlinderBlueI18n,
} = bigBlinderI18n.cards;
