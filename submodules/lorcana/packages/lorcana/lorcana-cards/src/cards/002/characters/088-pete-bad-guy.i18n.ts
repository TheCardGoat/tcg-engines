import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteBadGuyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Bad Guy",
    text: [
      {
        title: "Ward",
      },
      {
        title: "TAKE THAT!",
        description: "Whenever you play an action, this character gets +2 {S} this turn.",
      },
      {
        title: "WHO'S NEXT?",
        description: "While this character has 7 {S} or more, he gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Bösewicht",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "NIMM DAS!",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug +2.",
      },
      {
        title: "WER IST ALS NÄCHSTER DRAN?",
        description: "Solange dieser Charakter 7 oder mehr hat, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Mauvais garçon",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "PRENDS ÇA!",
        description:
          "Chaque fois que vous jouez une action, ce personnage gagne +2 pour le reste de ce tour. À QUI LE TOUR? Tant que ce personnage a au moins 7, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Pete",
    version: "Bad Guy",
    text: [
      {
        title: "Ward",
      },
      {
        title: "TAKE THAT!",
        description: "Whenever you play an action, this character gets +2 this turn.",
      },
      {
        title: "WHO'S NEXT?",
        description: "While this character has 7 or more, he gets +2.",
      },
    ],
  },
};
