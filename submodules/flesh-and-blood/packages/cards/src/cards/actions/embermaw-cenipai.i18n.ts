import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { embermawCenipai } from "./embermaw-cenipai.ts";

export const embermawCenipaiI18n = defineFamilyI18n(embermawCenipai, {
  en: {
    name: "Embermaw Cenipai",
    typeText: "Draconic Illusionist Action - Attack",
    text: "Phantasm\nWhen Embermaw Cenipai is destroyed, create an Ash token.",
  },
});

export const {
  red: embermawCenipaiRedI18n,
  yellow: embermawCenipaiYellowI18n,
  blue: embermawCenipaiBlueI18n,
} = embermawCenipaiI18n.cards;
