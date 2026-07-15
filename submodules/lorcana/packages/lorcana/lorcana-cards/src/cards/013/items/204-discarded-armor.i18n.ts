import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const discardedArmorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Discarded Armor",
    text: [
      {
        title: "Found Equipment",
        description:
          "{E} — If you discarded a card this turn, chosen character of yours gains <Resist> +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Ausrangierte Rüstung",
    text: [
      {
        title: "Gefundene Ausstattung",
        description:
          "{E} — Falls du in diesem Zug eine Karte abgeworfen hast, wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der ihm zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Armure délaissée",
    text: [
      {
        title: "Équipement récupéré",
        description:
          "{E} — Si vous avez défaussé une carte ce tour-ci, choisissez l'un de vos personnages qui gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Armatura Scartata",
    text: [
      {
        title: "Equipaggiamento Rinvenuto",
        description:
          "{E} — Se hai scartato una carta in questo turno, un tuo personaggio a tua scelta ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
