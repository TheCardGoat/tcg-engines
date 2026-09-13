import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fallenHerald } from "./fallen-herald.ts";

export const fallenHeraldI18n = defineFamilyI18n(fallenHerald, {
  en: {
    name: "Fallen Herald",
    typeText: "Shadow Action - Attack",
    text: "Instant - Banish this from your hand: Prevent the next 4 damage that would be dealt to you this turn.\nBlood Debt",
  },
});

export const { yellow: fallenHeraldYellowI18n } = fallenHeraldI18n.cards;
