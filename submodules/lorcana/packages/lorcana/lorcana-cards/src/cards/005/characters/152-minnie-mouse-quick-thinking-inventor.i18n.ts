import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseQuickthinkingInventorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Quick-Thinking Inventor",
    text: [
      {
        title: "CAKE CATAPULT",
        description: "When you play this character, chosen character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Geistesgegenwärtige Erfinderin",
    text: [
      {
        title: "KUCHEN-KATAPULT",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug -2.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Inventrice à l'esprit vif",
    text: [
      {
        title: "CATAPULTE À GÂTEAU",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Sveglia Inventrice",
    text: [
      {
        title: "CATAPULTA PER TORTE",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve -2 per questo turno.",
      },
    ],
  },
};
