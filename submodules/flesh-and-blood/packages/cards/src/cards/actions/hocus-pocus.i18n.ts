import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hocusPocus } from "./hocus-pocus.ts";

export const hocusPocusI18n = defineFamilyI18n(hocusPocus, {
  en: {
    name: "Hocus Pocus",
    text: "When this attacks, create a Runechant token.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: hocusPocusRedI18n,
  yellow: hocusPocusYellowI18n,
  blue: hocusPocusBlueI18n,
} = hocusPocusI18n.cards;
