import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowrealmSwiftness } from "./shadowrealm-swiftness.ts";

export const shadowrealmSwiftnessI18n = defineFamilyI18n(shadowrealmSwiftness, {
  en: {
    name: "Shadowrealm Swiftness",
    typeText: "Shadow Necromancer Action",
    text: "You may put a card from your banished zone into your graveyard. If it's a zombie, your next attack this turn gets go again.\nGo again",
  },
});

export const { yellow: shadowrealmSwiftnessYellowI18n } = shadowrealmSwiftnessI18n.cards;
