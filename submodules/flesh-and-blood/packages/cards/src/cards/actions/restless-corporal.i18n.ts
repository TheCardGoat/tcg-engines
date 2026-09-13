import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessCorporal } from "./restless-corporal.ts";
const textByColor = {
  red: "Action - {t}: Put a card from your banished zone into your graveyard. Go again\nDecay",
} as const;
export const restlessCorporalI18n = defineFamilyI18n(restlessCorporal, {
  en: {
    name: "Restless Corporal",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: restlessCorporalRedI18n } = restlessCorporalI18n.cards;
