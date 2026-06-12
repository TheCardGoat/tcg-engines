import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinOnTheEdgeOfAdventureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "On the Edge of Adventure",
    text: [
      {
        title: "QUICK ON HIS FEET",
        description:
          "Whenever you play an action, this character gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Am Rande des Abenteuers",
    text: [
      {
        title: "FLINK AUF DEN BEINEN",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter bis zu Beginn deines nächsten Zuges Wendig.",
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "Au seuil de l’aventure",
    text: [
      {
        title: "PRÊT À RÉAGIR",
        description:
          "Chaque fois que vous jouez une action, ce personnage gagne Insaisissable jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Sull'Orlo dell'Avventura",
    text: [
      {
        title: "SVELTO",
        description:
          "Ogni volta che giochi un'azione, questo personaggio ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
