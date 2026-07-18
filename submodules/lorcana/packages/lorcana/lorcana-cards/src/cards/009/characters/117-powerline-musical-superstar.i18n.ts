import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const powerlineMusicalSuperstarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Powerline",
    version: "Musical Superstar",
    text: [
      {
        title: "ELECTRIC MOVE",
        description:
          "If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Powerline",
    version: "Musikalischer Superstar",
    text: [
      {
        title: "Elektrische Bewegungen",
        description:
          "Falls du in diesem Zug mindestens 1 Lied ausgespielt hast, erhält dieser Charakter <Rasant>.",
      },
    ],
  },
  fr: {
    name: "Powerline",
    version: "Superstar de la musique",
    text: [
      {
        title: "Mouvement électrisant",
        description:
          "Si vous avez joué une chanson ce tour-ci, ce personnage gagne <Charge> pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Powerline",
    version: "Superstar Musicale",
    text: [
      {
        title: "Mossa Elettrica",
        description:
          "Se hai giocato una canzone in questo turno, questo personaggio ottiene <Lesto> per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
  es: {
    name: "Línea eléctrica",
    version: "Superestrella musical",
    text: [
      {
        title: "MOVIMIENTO ELÉCTRICO",
        description:
          "Si has tocado una canción este turno, este personaje gana Rush este turno. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
