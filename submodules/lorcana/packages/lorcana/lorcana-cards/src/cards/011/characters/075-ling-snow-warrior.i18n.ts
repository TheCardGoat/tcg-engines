import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lingSnowWarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ling",
    version: "Snow Warrior",
    text: [
      {
        title: "BUILDING MUSCLES 1",
        description: "{I} — Chosen character gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Ling",
    version: "Schneekrieger",
    text: [
      {
        title: "MUSKELN AUFBAUEN 1",
        description: "— Ein Charakter deiner Wahl erhält in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Ling",
    version: "Guerrier des neiges",
    text: [
      {
        title: "PRENDRE DU MUSCLE 1",
        description: "— Choisissez un personnage qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ling",
    version: "Guerriero delle Nevi",
    text: [
      {
        title: "METTERE SU MUSCOLI 1",
        description: "— Un personaggio a tua scelta riceve +1 per questo turno.",
      },
    ],
  },
};
