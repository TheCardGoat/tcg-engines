import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { concuss } from "./concuss.ts";

export const concussI18n = defineFamilyI18n(concuss, {
  en: {
    name: "Concuss",
    text: "When this hits a hero, if this has {p} greater than its base, they discard a card.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: concussRedI18n,
  yellow: concussYellowI18n,
  blue: concussBlueI18n,
} = concussI18n.cards;
