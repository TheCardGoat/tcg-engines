import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteBadGuyEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title: "<Behütet>",
      },
      {
        title: "Nimm das!",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug +2 {S}.",
      },
      {
        title: "Wer ist als Nächster dran?",
        description: "Solange dieser Charakter 7 oder mehr {S} hat, erhält er +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Mauvais garçon",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Prends ça!",
        description:
          "Chaque fois que vous jouez une action, ce personnage gagne +2 {S} pour le reste de ce tour.",
      },
      {
        title: "À qui le tour?",
        description: "Tant que ce personnage a au moins 7 {S}, il gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Pete",
    version: "Bad Guy",
    text: [
      {
        title: "<Ward> (Opponents can't choose this character except to challenge.)",
      },
      {
        title: "Take That!",
        description: "Whenever you play an action, this character gets +2 {S} this turn.",
      },
      {
        title: "Who's Next?",
        description: "While this character has 7 {S} or more, he gets +2 {L}.",
      },
    ],
  },
};
