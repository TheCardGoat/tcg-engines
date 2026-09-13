import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessTemplar } from "./restless-templar.ts";

export const restlessTemplarI18n = defineFamilyI18n(restlessTemplar, {
  en: {
    name: "Restless Templar",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "Whenever a Zombie you control with Decay dies, create a Gate to i'Arathael token.\nDecay",
  },
});
export const { red: restlessTemplarRedI18n } = restlessTemplarI18n.cards;
