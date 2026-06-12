import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hamsterBallI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hamster Ball",
    text: [
      {
        title: "ROLL WITH THE PUNCHES",
        description:
          "{E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Hamsterball",
    text: [
      {
        title: "FÄNGT JEDEN SCHLAG AB,",
        description:
          "1 — Ein unbeschädigter Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +2. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Boule de hamster",
    text: [
      {
        title: "FAIRE FACE AUX COUPS, 1",
        description:
          "— Choisissez un personnage sans dommage sur lui. Il gagne Résistance +2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Palla per Criceti",
    text: [
      {
        title: "RESISTENZA SFERICA, 1",
        description:
          "— Un personaggio a tua scelta senza danno ottiene Resistere +2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
