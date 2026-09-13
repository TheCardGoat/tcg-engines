import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deadwoodRumbler } from "./deadwood-rumbler.ts";

export const deadwoodRumblerI18n = defineFamilyI18n(deadwoodRumbler, {
  en: {
    name: "Deadwood Rumbler",
    text: "Draw a card then discard a random card. If a card with 6 or more {p} is discarded this way, banish a card from a graveyard.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: deadwoodRumblerRedI18n,
  yellow: deadwoodRumblerYellowI18n,
  blue: deadwoodRumblerBlueI18n,
} = deadwoodRumblerI18n.cards;
