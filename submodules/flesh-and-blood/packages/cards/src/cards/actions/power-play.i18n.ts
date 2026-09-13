import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { powerPlay } from "./power-play.ts";

export const powerPlayI18n = defineFamilyI18n(powerPlay, {
  en: {
    name: "Power Play",
    text: "If this was played from arsenal, it gets +5{p}.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: powerPlayRedI18n,
  yellow: powerPlayYellowI18n,
  blue: powerPlayBlueI18n,
} = powerPlayI18n.cards;
