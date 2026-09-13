import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { etchingsOfArcana } from "./etchings-of-arcana.ts";

export const etchingsOfArcanaI18n = defineFamilyI18n(etchingsOfArcana, {
  en: {
    name: "Etchings of Arcana",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, you may return an aura with Sigil in its name from your graveyard to your hand.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: etchingsOfArcanaRedI18n,
  yellow: etchingsOfArcanaYellowI18n,
  blue: etchingsOfArcanaBlueI18n,
} = etchingsOfArcanaI18n.cards;
