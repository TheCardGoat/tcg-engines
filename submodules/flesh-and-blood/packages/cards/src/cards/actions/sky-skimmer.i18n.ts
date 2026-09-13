import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { skySkimmer } from "./sky-skimmer.ts";

export const skySkimmerI18n = defineFamilyI18n(skySkimmer, {
  en: {
    name: "Sky Skimmer",
    text: "Once per Turn Instant - {t} a cog you control: This gets +1{p} or go again.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: skySkimmerRedI18n,
  yellow: skySkimmerYellowI18n,
  blue: skySkimmerBlueI18n,
} = skySkimmerI18n.cards;
