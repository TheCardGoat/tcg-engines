import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceGrowingGirlI18n: Record<Languages, I18nProperties> = {
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
        title: "WHAT DID",
        description: "I DO? While this character has 10 {S} or more, she gets +4 {L}.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Wachsendes Mädchen",
    text: [
      {
        title: "Das ist ein guter Rat",
        description:
          "Deine anderen Charaktere erhalten <Unterstützen>. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Was hab ich getan?",
        description: "Solange dieser Charakter 10 oder mehr {S} hat, erhält er +4 {L}.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "En pleine croissance",
    text: [
      {
        title: "Je sais ce que je dois faire",
        description:
          "Vos autres personnages gagnent <Soutien>. (Lorsqu'ils sont envoyés à l'aventure, vous pouvez ajouter leur {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Qu'ai-je fait?",
        description: "Tant que ce personnage a au moins 10 {S}, il gagne +4 {L}.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Growing Girl",
    text: [
      {
        title: "Good Advice",
        description:
          "Your other characters gain <Support>. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
      {
        title: "What Did I Do?",
        description: "While this character has 10 {S} or more, she gets +4 {L}.",
      },
    ],
  },
};
