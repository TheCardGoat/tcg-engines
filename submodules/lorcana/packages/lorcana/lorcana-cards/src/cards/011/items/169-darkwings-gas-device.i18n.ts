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
        title: "Blendende Wolke",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug -1 {S}. Falls du einen Darkwing-Duck-Charakter im Spiel hast, erhält der Charakter in diesem Zug stattdessen -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Appareil à gaz de Myster Mask",
    text: [
      {
        title: "Nuage aveuglant",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui subit -1 {S} pour le reste de ce tour. Si vous avez un personnage Myster Mask en jeu, le personnage choisi subit -2 {S} à la place.",
      },
    ],
  },
  it: {
    name: "Apparecchio a Gas di Darkwing",
    text: [
      {
        title: "Nuvola Accecante",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta riceve -1 {S} per questo turno. Se hai in gioco un personaggio chiamato Darkwing Duck, un personaggio a tua scelta riceve invece -2 {S} per questo turno.",
      },
    ],
  },
};
