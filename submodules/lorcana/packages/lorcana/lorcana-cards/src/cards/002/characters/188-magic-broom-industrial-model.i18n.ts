import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomIndustrialModelI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Industrial Model",
    text: [
      {
        title: "MAKE IT SHINE",
        description:
          "When you play this character, chosen character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Industrieausführung",
    text: [
      {
        title: "AUF HOCHGLANZ POLIEREN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges Robust +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Balais magiques",
    version: "Modèle industriel",
    text: [
      {
        title: "FAUT QUE ÇA BRILLE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Résistance +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Modello Industriale",
    text: [
      {
        title: "FALLO BRILLARE",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Resistere +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
