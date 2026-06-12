import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const crikeeLuckyCricketI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cri-Kee",
    version: "Lucky Cricket",
    text: [
      {
        title: "SPREADING GOOD FORTUNE",
        description: "When you play this character, your other characters get +3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Kriki",
    version: "Glücksgrille",
    text: [
      {
        title: "GLÜCK BRINGEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhalten deine anderen Charaktere in diesem Zug +3.",
      },
    ],
  },
  fr: {
    name: "Cri-Kee",
    version: "Criquet porte-bonheur",
    text: [
      {
        title: "PROPAGEANT LA BONNE FORTUNE",
        description:
          "Lorsque vous jouez ce personnage, vos autres personnages gagnent +3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cri-Cri",
    version: "Grillo Fortunato",
    text: [
      {
        title: "PORTARE FORTUNA",
        description:
          "Quando giochi questo personaggio, i tuoi altri personaggi ricevono +3 per questo turno.",
      },
    ],
  },
};
