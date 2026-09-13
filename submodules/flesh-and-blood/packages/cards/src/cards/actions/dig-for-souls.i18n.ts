import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { digForSouls } from "./dig-for-souls.ts";

export const digForSoulsI18n = defineFamilyI18n(digForSouls, {
  en: {
    name: "Dig for Souls",
    typeText: "Shadow Necromancer Action",
    text: 'Look at the top X cards of your deck. You may put a zombie from among them into your graveyard, then put the rest on the bottom of your deck in any order.\nYour next zombie attack this turn gets +4{p} and "When this hits, destroy this zombie."\nGo again',
  },
});

export const { red: digForSoulsRedI18n } = digForSoulsI18n.cards;
