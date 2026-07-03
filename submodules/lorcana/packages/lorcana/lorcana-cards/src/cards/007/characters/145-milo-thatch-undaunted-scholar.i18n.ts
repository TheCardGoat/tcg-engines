import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const miloThatchUndauntedScholarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Milo Thatch",
    version: "Undaunted Scholar",
    text: [
      {
        title: "I'M YOUR GUY",
        description: "Whenever you play an action, you may give chosen character +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Milo Thatch",
    version: "Unerschrockener Wissenschaftler",
    text: [
      {
        title: "Ich bin dein Mann",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, darfst du einem Charakter deiner Wahl in diesem Zug +2 {S} geben.",
      },
    ],
  },
  fr: {
    name: "Milo Thatch",
    version: "Universitaire intrépide",
    text: [
      {
        title: "Je suis votre homme",
        description:
          "Chaque fois que vous jouez une action, vous pouvez choisir un personnage qui gagne +2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Milo Thatch",
    version: "Studioso Imperterrito",
    text: [
      {
        title: "Sono il tuo Uomo",
        description:
          "Ogni volta che giochi un'azione, puoi dare +2 {S} a un personaggio a tua scelta per questo turno.",
      },
    ],
  },
};
