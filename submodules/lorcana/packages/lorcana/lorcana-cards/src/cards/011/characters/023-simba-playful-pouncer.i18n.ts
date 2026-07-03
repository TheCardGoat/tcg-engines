import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const simbaPlayfulPouncerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Simba",
    version: "Playful Pouncer",
    text: [
      {
        title: "YOU DON'T STAND",
        description:
          "A CHANCE When you play this character, chosen opposing character gets -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Simba",
    version: "Verspielter Fänger",
    text: [
      {
        title: "Du hast keine Chance",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Simba",
    version: "Bondisseur espiègle",
    text: [
      {
        title: "Tu n'as aucune chance",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -2 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Simba",
    version: "Predatore Giocherellone",
    text: [
      {
        title: "Non Hai Scampo",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -2 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
