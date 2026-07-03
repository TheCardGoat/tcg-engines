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
        title: "Muskeln aufbauen",
        description: "1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Ling",
    version: "Guerrier des neiges",
    text: [
      {
        title: "Prendre du muscle",
        description: "1 {I} — Choisissez un personnage qui gagne +1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ling",
    version: "Guerriero delle Nevi",
    text: [
      {
        title: "Mettere Su Muscoli",
        description: "1 {I} — Un personaggio a tua scelta riceve +1 {S} per questo turno.",
      },
    ],
  },
};
