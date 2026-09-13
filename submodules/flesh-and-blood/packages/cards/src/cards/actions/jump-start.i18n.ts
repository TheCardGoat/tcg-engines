import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { jumpStart } from "./jump-start.ts";

export const jumpStartI18n = defineFamilyI18n(jumpStart, {
  en: {
    name: "Jump Start",
    text: "If you control a Hyper Driver, this costs {r} less to play.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: jumpStartRedI18n,
  yellow: jumpStartYellowI18n,
  blue: jumpStartBlueI18n,
} = jumpStartI18n.cards;
