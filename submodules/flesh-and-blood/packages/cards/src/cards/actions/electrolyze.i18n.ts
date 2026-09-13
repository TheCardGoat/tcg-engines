import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { electrolyze } from "./electrolyze.ts";

export const electrolyzeI18n = defineFamilyI18n(electrolyze, {
  en: {
    name: "Electrolyze",
    typeText: "Lightning Action - Attack",
    text: "Go again",
  },
});

export const {
  red: electrolyzeRedI18n,
  yellow: electrolyzeYellowI18n,
  blue: electrolyzeBlueI18n,
} = electrolyzeI18n.cards;
