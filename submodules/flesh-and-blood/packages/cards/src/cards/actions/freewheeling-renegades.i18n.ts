import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { freewheelingRenegades } from "./freewheeling-renegades.ts";

export const freewheelingRenegadesI18n = defineFamilyI18n(freewheelingRenegades, {
  en: {
    name: "Freewheeling Renegades",
    typeText: "Generic Action - Attack",
    text: "If this is defended by an action card, this has -2{p}.",
  },
});

export const {
  red: freewheelingRenegadesRedI18n,
  yellow: freewheelingRenegadesYellowI18n,
  blue: freewheelingRenegadesBlueI18n,
} = freewheelingRenegadesI18n.cards;
