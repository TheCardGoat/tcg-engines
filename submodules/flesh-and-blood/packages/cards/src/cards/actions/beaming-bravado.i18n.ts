import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { beamingBravado } from "./beaming-bravado.ts";

export const beamingBravadoI18n = defineFamilyI18n(beamingBravado, {
  en: {
    name: "Beaming Bravado",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play this, you may charge your hero's soul.\nIf a yellow card is charged this way, this gets +1{p}",
  },
});

export const {
  red: beamingBravadoRedI18n,
  yellow: beamingBravadoYellowI18n,
  blue: beamingBravadoBlueI18n,
} = beamingBravadoI18n.cards;
