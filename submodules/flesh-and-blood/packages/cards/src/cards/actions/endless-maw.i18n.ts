import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { endlessMaw } from "./endless-maw.ts";

export const endlessMawI18n = defineFamilyI18n(endlessMaw, {
  en: {
    name: "Endless Maw",
    text: "As an additional cost to play Endless Maw, banish 3 random cards from your graveyard.\nIf a card with 6 or more {p} is banished this way, Endless maw gains +3{p}.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: endlessMawRedI18n,
  yellow: endlessMawYellowI18n,
  blue: endlessMawBlueI18n,
} = endlessMawI18n.cards;
