import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { enigmaChimera } from "./enigma-chimera.ts";

export const enigmaChimeraI18n = defineFamilyI18n(enigmaChimera, {
  en: {
    name: "Enigma Chimera",
    typeText: "Illusionist Action - Attack",
    text: "Phantasm",
  },
});

export const {
  red: enigmaChimeraRedI18n,
  yellow: enigmaChimeraYellowI18n,
  blue: enigmaChimeraBlueI18n,
} = enigmaChimeraI18n.cards;
