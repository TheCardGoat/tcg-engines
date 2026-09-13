import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rememberTheMists } from "./remember-the-mists.ts";

export const rememberTheMistsI18n = defineFamilyI18n(rememberTheMists, {
  en: {
    name: "Remember the Mists",
    typeText: "Assassin Action - Attack",
    text: "When this hits a hero, look at their hand and banish a card. They may play the banished card until the end of their next turn.\nIf this wasn't played from hand or arsenal, it gets +2{p}.",
  },
});

export const { blue: rememberTheMistsBlueI18n } = rememberTheMistsI18n.cards;
