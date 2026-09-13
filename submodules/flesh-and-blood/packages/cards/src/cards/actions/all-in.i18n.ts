import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { allIn } from "./all-in.ts";

export const allInI18n = defineFamilyI18n(allIn, {
  en: {
    name: "All In",
    typeText: "Warrior Action",
    text: "The next time a sword you control attacks this turn, destroy all Gold you control. The attack gets +2{p} for each Gold destroyed this way. When the chain link resolves, if the attack didn't hit, you lose the game.\nGo again",
  },
});

export const { red: allInRedI18n } = allInI18n.cards;
