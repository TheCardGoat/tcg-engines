import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { longShot } from "./long-shot.ts";

export const longShotI18n = defineFamilyI18n(longShot, {
  en: {
    name: "Long Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Long Shot has an aim counter, it has +2{p}.",
  },
});

export const {
  red: longShotRedI18n,
  yellow: longShotYellowI18n,
  blue: longShotBlueI18n,
} = longShotI18n.cards;
