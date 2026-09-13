import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowrealmStrength } from "./shadowrealm-strength.ts";

export const shadowrealmStrengthI18n = defineFamilyI18n(shadowrealmStrength, {
  en: {
    name: "Shadowrealm Strength",
    typeText: "Shadow Necromancer Action",
    text: "You may put a card from your banished zone into your graveyard. If it's a zombie, your next attack this turn gets +3{p}.\nGo again",
  },
});

export const { red: shadowrealmStrengthRedI18n } = shadowrealmStrengthI18n.cards;
