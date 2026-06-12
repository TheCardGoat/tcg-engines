import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gadgetHackwrenchCreativeThinkerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gadget Hackwrench",
    version: "Creative Thinker",
    text: [
      {
        title: "BRAINSTORM",
        description: "Whenever you play an item, this character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Trixi",
    version: "Kreativer Kopf",
    text: [
      {
        title: "GEISTESBLITZ",
        description:
          "Jedes Mal, wenn du einen Gegenstand ausspielst, erhält dieser Charakter in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Gadget",
    version: "Esprit créatif",
    text: [
      {
        title: "REMUE-MÉNINGES",
        description:
          "Chaque fois que vous jouez un objet, ce personnage gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scheggia Hackwrench",
    version: "Pensatrice Creativa",
    text: [
      {
        title: "SCERVELLARSI",
        description:
          "Ogni volta che giochi un oggetto, questo personaggio riceve +1 per questo turno.",
      },
    ],
  },
};
