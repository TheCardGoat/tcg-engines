import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { conquerTheIcyTerrain } from "./conquer-the-icy-terrain.ts";

export const conquerTheIcyTerrainI18n = defineFamilyI18n(conquerTheIcyTerrain, {
  en: {
    name: "Conquer the Icy Terrain",
    text: "When this hits a hero, they may pay {r}{r}. If they don't, you may destroy a frozen card in their arsenal or a frozen non-hero permanent they control.",
    typeText: "Ice Action - Attack",
  },
});

export const {
  red: conquerTheIcyTerrainRedI18n,
  yellow: conquerTheIcyTerrainYellowI18n,
  blue: conquerTheIcyTerrainBlueI18n,
} = conquerTheIcyTerrainI18n.cards;
