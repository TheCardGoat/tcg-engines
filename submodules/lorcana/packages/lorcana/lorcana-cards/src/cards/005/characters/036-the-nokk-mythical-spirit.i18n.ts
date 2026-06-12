import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theNokkMythicalSpiritI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Nokk",
    version: "Mythical Spirit",
    text: [
      {
        title: "TURNING TIDES",
        description:
          "When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Der Nokk",
    version: "Mystischer Geist",
    text: [
      {
        title: "GEZEITENWECHSEL",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du bis zu 2 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Nokk",
    version: "Esprit mythique",
    text: [
      {
        title: "MARÉES CHANGEANTES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et déplacer jusqu'à 2 de ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Il Nokk",
    version: "Spirito Mitico",
    text: [
      {
        title: "INVERTIRE LA MAREA",
        description:
          "Quando giochi questo personaggio, puoi spostare fino a 2 segnalini danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
