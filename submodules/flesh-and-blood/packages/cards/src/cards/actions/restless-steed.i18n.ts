import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessSteed } from "./restless-steed.ts";

export const restlessSteedI18n = defineFamilyI18n(restlessSteed, {
  en: {
    name: "Restless Steed",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "When this hits, the attack gets go again.\nDecay",
  },
});

export const { red: restlessSteedRedI18n } = restlessSteedI18n.cards;
