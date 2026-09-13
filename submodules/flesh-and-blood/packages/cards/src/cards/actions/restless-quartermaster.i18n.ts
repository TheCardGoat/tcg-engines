import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessQuartermaster } from "./restless-quartermaster.ts";

export const restlessQuartermasterI18n = defineFamilyI18n(restlessQuartermaster, {
  en: {
    name: "Restless Quartermaster",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "When this hits a hero, they banish a card in their arsenal.\nDecay",
  },
});

export const { red: restlessQuartermasterRedI18n } = restlessQuartermasterI18n.cards;
