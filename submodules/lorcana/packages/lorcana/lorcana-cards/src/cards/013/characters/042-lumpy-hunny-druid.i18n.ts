import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lumpyHunnyDruidI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lumpy",
    version: "Hunny Druid",
    text: [
      {
        title: "WELCOME HEALING",
        description:
          "When you play this character, you may move up to 2 damage from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Lumpi",
    version: "Honig-Druide",
    text: [
      {
        title: "Willkommene Heilung",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du bis zu 2 Schaden von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Lumpy",
    version: "Druide mellifique",
    text: [
      {
        title: "Soins bienvenus",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et déplacer jusqu'à 2 de ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Effy",
    version: "Druido del Miele",
    text: [
      {
        title: "Gradita Guarigione",
        description:
          "Quando giochi questo personaggio, puoi spostare fino a 2 danni da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
