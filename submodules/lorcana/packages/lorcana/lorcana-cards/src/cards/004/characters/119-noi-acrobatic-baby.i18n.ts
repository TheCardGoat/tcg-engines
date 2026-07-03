import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const noiAcrobaticBabyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Noi",
    version: "Acrobatic Baby",
    text: [
      {
        title: "FANCY FOOTWORK",
        description:
          "Whenever you play an action, this character takes no damage from challenges this turn.",
      },
    ],
  },
  de: {
    name: "Kleine Noi",
    version: "Akrobatisches Baby",
    text: [
      {
        title: "Raffinierte Beinarbeit",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug keinen Schaden durch Herausforderungen.",
      },
    ],
  },
  fr: {
    name: "Bébé Noï",
    version: "Bébé acrobate",
    text: [
      {
        title: "Jeu de jambes remarquable",
        description:
          "Chaque fois que vous jouez une action, ce personnage ne subit aucun dommage lors des défis pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Noi",
    version: "Bambina Acrobatica",
    text: [
      {
        title: "Acrobazie",
        description:
          "Ogni volta che giochi un'azione, questo personaggio non subisce danni dalle sfide per questo turno.",
      },
    ],
  },
};
