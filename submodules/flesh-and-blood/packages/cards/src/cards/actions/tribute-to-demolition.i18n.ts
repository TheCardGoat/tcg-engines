import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tributeToDemolition } from "./tribute-to-demolition.ts";

export const tributeToDemolitionI18n = defineFamilyI18n(tributeToDemolition, {
  en: {
    name: "Tribute to Demolition",
    text: "As an additional cost to play this, banish a random card from your hand.\nIf a card with 6 or more {p} is banished this way, this gets +2{p}.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: tributeToDemolitionRedI18n,
  yellow: tributeToDemolitionYellowI18n,
  blue: tributeToDemolitionBlueI18n,
} = tributeToDemolitionI18n.cards;
