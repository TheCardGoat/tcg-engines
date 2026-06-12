import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pickAFightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pick a Fight",
    text: "Chosen character can challenge ready characters this turn.",
  },
  de: {
    name: "Streit anzetteln",
    text: "Wähle einen Charakter. Er kann in diesem Zug bereite Charaktere herausfordern.",
  },
  fr: {
    name: "Choisir son combat",
    text: "Choisissez un personnage, il peut défier des personnages redressés pour le reste de ce tour.",
  },
  it: {
    name: "Attaccare Briga",
    text: "Un personaggio a tua scelta può sfidare i personaggi preparati per questo turno.",
  },
};
