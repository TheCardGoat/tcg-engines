import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilTenaciousMouseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil",
    version: "Tenacious Mouse",
    text: [
      {
        title: "HOLD YOUR GROUND",
        description:
          "Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Basil",
    version: "Hartnäckige Maus",
    text: [
      {
        title: "HÄLT DIE STELLUNG",
        description:
          "Jedes Mal, wenn du einen anderen Detektiv ausspielst, erhält dieser Charakter bis zu Beginn deines nächsten Zuges Robust +1. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Basil",
    version: "Souris tenace",
    text: [
      {
        title: "TENIR LA POSITION",
        description:
          "Chaque fois que vous jouez un autre personnage Détective, ce personnage-ci gagne Résistance +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Basil",
    version: "Topo Tenace",
    text: [
      {
        title: "DIFENDERE LA POSIZIONE",
        description:
          "Ogni volta che giochi un altro personaggio Detective, questo personaggio ottiene Resistere +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
