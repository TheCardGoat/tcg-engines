import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const darkwingsGasDeviceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Darkwing's Gas Device",
    text: [
      {
        title: "BLINDING CLOUD",
        description:
          "{E}, 1 {I} — Chosen character gets -1 {S} this turn. If you have a character named Darkwing Duck in play, chosen character gets -2 {S} this turn instead.",
      },
    ],
  },
  de: {
    name: "Darkwings Gaspistole",
    text: [
      {
        title: "BLENDENDE WOLKE, 1",
        description:
          "— Ein Charakter deiner Wahl erhält in diesem Zug -1. Falls du einen Darkwing-Duck-Charakter im Spiel hast, erhält der Charakter in diesem Zug stattdessen -2.",
      },
    ],
  },
  fr: {
    name: "Appareil à gaz de Myster Mask",
    text: [
      {
        title: "NUAGE AVEUGLANT, 1",
        description:
          "— Choisissez un personnage qui subit -1 pour le reste de ce tour. Si vous avez un personnage Myster Mask en jeu, le personnage choisi subit -2 à la place.",
      },
    ],
  },
  it: {
    name: "Apparecchio a Gas di Darkwing",
    text: [
      {
        title: "NUVOLA ACCECANTE, 1",
        description:
          "— Un personaggio a tua scelta riceve -1 per questo turno. Se hai in gioco un personaggio chiamato Darkwing Duck, un personaggio a tua scelta riceve invece -2 per questo turno.",
      },
    ],
  },
};
