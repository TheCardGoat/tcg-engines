import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hanasInkcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hana's Inkcaster",
    text: [
      {
        title: "Rejuvenating Flourish",
        description:
          "{E} — Remove up to 2 damage from chosen character. If there's a card under that character, they gain <Resist> +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Hanas Tintenformer",
    text: [
      {
        title: "Verjüngende Kraft",
        description:
          "{E} — Entferne bis zu 2 Schaden von einem Charakter deiner Wahl. Falls jener Charakter mindestens eine Karte unter sich hat, erhält er bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Invocateur d’encre de Hana",
    text: [
      {
        title: "Efflorescence régénératrice",
        description:
          "{E} — Choisissez un personnage et retirez-lui jusqu'à 2 dommages. S'il y a une carte sous ce personnage, il gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Inchiostratore di Hana",
    text: [
      {
        title: "Fioritura Rigenerante",
        description:
          "{E} — Rimuovi fino a 2 danni da un personaggio a tua scelta. Se c'è una carta sotto a quel personaggio, ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "El lanzador de tinta de Hana",
    text: [
      {
        title: "Florecimiento rejuvenecedor",
        description:
          "{E}: elimina hasta 2 daños del personaje elegido. Si hay una carta debajo de ese personaje, gana <Resistir> +1 hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
