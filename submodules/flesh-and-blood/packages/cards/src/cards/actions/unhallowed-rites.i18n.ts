import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { unhallowedRites } from "./unhallowed-rites.ts";

export const unhallowedRitesI18n = defineFamilyI18n(unhallowedRites, {
  en: {
    name: "Unhallowed Rites",
    text: "If you have played a 'non-attack' action card this turn, you may play Unhallowed Rites from your banished zone.\nYou may put a 'non-attack' action card with blood debt from your graveyard on the bottom of your deck.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: unhallowedRitesRedI18n,
  yellow: unhallowedRitesYellowI18n,
  blue: unhallowedRitesBlueI18n,
} = unhallowedRitesI18n.cards;
