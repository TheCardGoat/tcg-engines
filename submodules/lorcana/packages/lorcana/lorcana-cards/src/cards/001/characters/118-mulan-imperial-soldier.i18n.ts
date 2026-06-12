import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mulanImperialSoldierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mulan",
    version: "Imperial Soldier",
    text: [
      {
        title: "LEAD BY EXAMPLE",
        description:
          "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Mulan",
    version: "Kaiserliche Soldatin",
    text: [
      {
        title: "MIT GUTEM BEISPIEL VORANGEHEN",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, erhalten deine anderen Charaktere in diesem Zug je +1.",
      },
    ],
  },
  fr: {
    name: "MULAN",
    version: "Soldat impérial",
    text: [
      {
        title: "UN EXEMPLE",
        description:
          "Lorsque ce personnage en bannit un autre via un défi durant votre tour, tous vos autres personnages gagnent +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mulan",
    version: "Imperial Soldier",
    text: [
      {
        title: "LEAD BY EXAMPLE",
        description:
          "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 this turn.",
      },
    ],
  },
};
