import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bullBar } from "./bull-bar.ts";

export const bullBarI18n = defineFamilyI18n(bullBar, {
  en: {
    name: "Bull Bar",
    text: "Boost\nIf you control a Hyper Driver, this gets overpower.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: bullBarRedI18n,
  yellow: bullBarYellowI18n,
  blue: bullBarBlueI18n,
} = bullBarI18n.cards;
