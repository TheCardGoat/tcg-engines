import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowrealmSolace } from "./shadowrealm-solace.ts";

export const shadowrealmSolaceI18n = defineFamilyI18n(shadowrealmSolace, {
  en: {
    name: "Shadowrealm Solace",
    typeText: "Shadow Necromancer Action",
    text: "You may put a card from your banished zone into your graveyard. If it's a zombie, gain 1{h}.\nGo again",
  },
});

export const { blue: shadowrealmSolaceBlueI18n } = shadowrealmSolaceI18n.cards;
