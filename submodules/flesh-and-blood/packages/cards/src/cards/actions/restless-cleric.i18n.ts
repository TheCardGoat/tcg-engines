import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessCleric } from "./restless-cleric.ts";

export const restlessClericI18n = defineFamilyI18n(restlessCleric, {
  en: {
    name: "Restless Cleric",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "Action - {t}: Gain 1{h}. Go again\nDecay",
  },
});

export const { red: restlessClericRedI18n } = restlessClericI18n.cards;
