import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dreadScreamer } from "./dread-screamer.ts";

export const dreadScreamerI18n = defineFamilyI18n(dreadScreamer, {
  en: {
    name: "Dread Screamer",
    text: "As an additional cost to play Dread Screamer, banish 3 random cards from your graveyard\nIf a card with 6 or more {p} is banished this way, Dread Screamer gains go again.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: dreadScreamerRedI18n,
  yellow: dreadScreamerYellowI18n,
  blue: dreadScreamerBlueI18n,
} = dreadScreamerI18n.cards;
