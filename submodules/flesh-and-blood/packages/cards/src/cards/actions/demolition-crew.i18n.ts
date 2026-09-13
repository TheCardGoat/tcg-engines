import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { demolitionCrew } from "./demolition-crew.ts";

export const demolitionCrewI18n = defineFamilyI18n(demolitionCrew, {
  en: {
    name: "Demolition Crew",
    typeText: "Generic Action - Attack",
    text: "As an additional cost to play Demolition Crew, reveal a card in your hand with cost 2 or greater.\\nDominate",
  },
});

export const {
  red: demolitionCrewRedI18n,
  yellow: demolitionCrewYellowI18n,
  blue: demolitionCrewBlueI18n,
} = demolitionCrewI18n.cards;
