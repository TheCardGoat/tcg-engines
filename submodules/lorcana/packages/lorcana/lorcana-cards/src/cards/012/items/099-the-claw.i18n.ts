import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theClawI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Claw",
    text: [
      {
        title: "THE CLAW CHOOSES",
        description:
          "{E}, 2 {I}, Banish one of your characters — Return chosen opposing character to their player's hand.",
      },
    ],
  },
  de: {
    name: "Die Kralle",
    text: [
      {
        title: "Die Kralle bestimmt",
        description:
          "{E}, 2 {I}, Verbanne einen deiner Charaktere — Schicke einen gegnerischen Charakter deiner Wahl auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Le Grappin",
    text: [
      {
        title: "Il choisit",
        description:
          "{E}, 2 {I}, Bannissez l'un de vos personnages — Choisissez un personnage adverse et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "L'Artiglio",
    text: [
      {
        title: "L'Artiglio Sceglie",
        description:
          "{E}, 2 {I}, esilia uno dei tuoi personaggi — Fai riprendere in mano al suo giocatore un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "La garra",
    text: [
      {
        title: "LA GARRA ELIGE",
        description:
          "{E}, 2 {I}, destierra a uno de tus personajes: devuelve el personaje contrario elegido a la mano de su jugador.",
      },
    ],
  },
};
