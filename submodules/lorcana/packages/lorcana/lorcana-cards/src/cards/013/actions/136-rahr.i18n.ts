import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rahrI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "RAHR!",
    text: "Chosen character gets +3 {S} this turn.",
  },
  de: {
    name: "RAHR!",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug +3 {S}.",
  },
  fr: {
    name: "Roar !",
    text: "Choisissez un personnage qui gagne +3 {S} pour le reste de ce tour.",
  },
  it: {
    name: "ROAR!",
    text: "Un personaggio a tua scelta riceve +3 {S} per questo turno.",
  },
};
