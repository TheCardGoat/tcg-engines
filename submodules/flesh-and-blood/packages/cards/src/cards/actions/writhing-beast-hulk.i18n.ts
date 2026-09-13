import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { writhingBeastHulk } from "./writhing-beast-hulk.ts";

export const writhingBeastHulkI18n = defineFamilyI18n(writhingBeastHulk, {
  en: {
    name: "Writhing Beast Hulk",
    text: "As an additional cost to play Writhing Beast Hulk, banish 3 random cards from your graveyard.\nIf a card with 6 or more {p} is banished this way, Writhing Beast Hulk gains dominate.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: writhingBeastHulkRedI18n,
  yellow: writhingBeastHulkYellowI18n,
  blue: writhingBeastHulkBlueI18n,
} = writhingBeastHulkI18n.cards;
