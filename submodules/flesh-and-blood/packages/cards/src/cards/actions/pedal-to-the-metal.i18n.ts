import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pedalToTheMetal } from "./pedal-to-the-metal.ts";

export const pedalToTheMetalI18n = defineFamilyI18n(pedalToTheMetal, {
  en: {
    name: "Pedal to the Metal",
    text: "If Pedal to the Metal hits, your next attack this turn gains dominate.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: pedalToTheMetalRedI18n,
  yellow: pedalToTheMetalYellowI18n,
  blue: pedalToTheMetalBlueI18n,
} = pedalToTheMetalI18n.cards;
