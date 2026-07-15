import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinShapeshifterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Shapeshifter",
    text: [
      {
        title: "BATTLE OF WITS",
        description:
          "Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Formwandler",
    text: [
      {
        title: "Kampf der Geister",
        description:
          "Dieser Charakter erhält jedes Mal, wenn einer deiner anderen Charaktere aus dem Spiel auf deine Hand zurückkehrt, in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "Métamorphe",
    text: [
      {
        title: "Bataille d'esprits",
        description:
          "Chaque fois que vous renvoyez l'un de vos autres personnages dans votre main, ce personnage gagne +1 {L} pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Merlin",
    version: "Shapeshifter",
    text: [
      {
        title: "Battle of Wits",
        description:
          "Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
      },
    ],
  },
};
