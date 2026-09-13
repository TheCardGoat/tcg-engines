import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { descendentGustwave } from "./descendent-gustwave.ts";

export const descendentGustwaveI18n = defineFamilyI18n(descendentGustwave, {
  en: {
    name: "Descendent Gustwave",
    typeText: "Ninja Action - Attack",
    text: "Combo - If Surging Strike was the last attack this combat chain, this costs {r} less to play and has +2{p}.\nGo again",
  },
});

export const {
  red: descendentGustwaveRedI18n,
  yellow: descendentGustwaveYellowI18n,
  blue: descendentGustwaveBlueI18n,
} = descendentGustwaveI18n.cards;
