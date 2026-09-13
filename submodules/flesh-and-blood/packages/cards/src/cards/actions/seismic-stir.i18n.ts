import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { seismicStir } from "./seismic-stir.ts";

export const seismicStirI18n = defineFamilyI18n(seismicStir, {
  en: {
    name: "Seismic Stir",
    text: ({ value1 }) =>
      `${value1 === 1 ? "Create a Seismic Surge token." : `Create ${value1} Seismic Surge tokens.`}
Go again`,
    typeText: "Guardian Action",
  },
});

export const {
  red: seismicStirRedI18n,
  yellow: seismicStirYellowI18n,
  blue: seismicStirBlueI18n,
} = seismicStirI18n.cards;
