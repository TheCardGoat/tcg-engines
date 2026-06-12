import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceGrowingGirlEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Growing Girl",
    text: [
      {
        title: "GOOD ADVICE",
        description:
          "Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
      {
        title: "WHAT DID I DO?",
        description: "While this character has 10 {S} or more, she gets +4 {L}.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Wachsendes Mädchen",
    text: [
      {
        title: "DAS IST EIN GUTER RAT",
        description:
          "Deine anderen Charaktere erhalten Unterstützen. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "WAS HAB ICH GETAN?",
        description: "Solange dieser Charakter 10 oder mehr hat, erhält er +4.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "En pleine croissance",
    text: [
      {
        title: "JE SAIS CE QUE JE DOIS FAIRE",
        description:
          "Vos autres personnages gagnent Soutien. (Lorsqu'ils sont envoyés à l'aventure, vous pouvez ajouter leur à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "QU'AI-JE FAIT?",
        description: "Tant que ce personnage a au moins 10, il gagne +4.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Growing Girl",
    text: [
      {
        title: "GOOD ADVICE",
        description:
          "Your other characters gain Support. (Whenever they quest, you may add their to another chosen character's this turn.)",
      },
      {
        title: "WHAT DID I DO?",
        description: "While this character has 10 or more, she gets +4.",
      },
    ],
  },
};
