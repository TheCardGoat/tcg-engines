import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipRetrievalExpertI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip",
    version: "Retrieval Expert",
    text: [
      {
        title: "THERE YOU ARE!",
        description:
          "When you play this character, you may return a character card with 4 {W} or more from your discard to your hand.",
      },
      {
        title: "FRIENDLY ASSIST",
        description: "Your characters named Dale get +1 {W}.",
      },
    ],
  },
  de: {
    name: "Chip",
    version: "Suchspezialist",
    text: [
      {
        title: "Da bist du ja!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du eine Charakterkarte aus deinem Ablagestapel mit 4 oder mehr {W} zurück auf deine Hand nehmen.",
      },
      {
        title: "Freundliche Unterstützung",
        description: "Deine Chap-Charaktere erhalten +1 {W}.",
      },
    ],
  },
  fr: {
    name: "Tic",
    version: "Expert en récupération",
    text: [
      {
        title: "Te voilà!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez renvoyer dans votre main une carte Personnage ayant 4 {W} ou plus de votre défausse.",
      },
      {
        title: "Assistance amicale",
        description: "Vos personnages nommés Tac gagnent +1 {W}.",
      },
    ],
  },
  it: {
    name: "Cip",
    version: "Esperto di Recuperi",
    text: [
      {
        title: "Eccoti!",
        description:
          "Quando giochi questo personaggio, puoi riprendere in mano una carta personaggio con 4 {W} o superiore dai tuoi scarti.",
      },
      {
        title: "Aiuto Amichevole",
        description: "I tuoi personaggi chiamati Ciop ricevono +1 {W}.",
      },
    ],
  },
};
