import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mouseArmorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mouse Armor",
    text: [
      {
        title: "PROTECTION",
        description: "{E} — Chosen character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Mäuserüstung",
    text: [
      {
        title: "SCHUTZ",
        description:
          "— Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Armure de souris",
    text: [
      {
        title: "PROTECTION",
        description:
          "— Choisissez un personnage, il gagne Résistance +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Armatura per Topi",
    text: [
      {
        title: "PROTEZIONE",
        description:
          "— Un personaggio a tua scelta ottiene Resistere +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
