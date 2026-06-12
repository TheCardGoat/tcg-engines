import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const panicHighstrungImpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Panic",
    version: "High-Strung Imp",
    text: [
      {
        title: "STARTLED SHRIEK",
        description:
          "When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Schwefel",
    version: "Nervöser Wicht",
    text: [
      {
        title: "ERSCHROCKENER SCHREI",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du bis zu 2 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Panique",
    version: "Diablotin tendu",
    text: [
      {
        title: "CRI EFFAROUCHÉ",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et déplacer jusqu'à 2 de ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Panico",
    version: "Diavoletto Nervoso",
    text: [
      {
        title: "STRILLO SORPRESO",
        description:
          "Quando giochi questo personaggio, puoi spostare fino a 2 segnalini danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
