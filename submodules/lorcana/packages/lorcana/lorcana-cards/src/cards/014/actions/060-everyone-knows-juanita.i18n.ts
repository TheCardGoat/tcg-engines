import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const everyoneKnowsJuanitaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Everyone Knows Juanita",
    text: "Draw 2 cards. If you have 10 or more cards in your discard, draw 3 cards instead.",
  },
  de: {
    name: "Die ganze Welt kennt Juanita",
    text: "Ziehe 2 Karten. Falls du 10 oder mehr Karten in deinem Ablagestapel hast, ziehe stattdessen 3 Karten.",
  },
  fr: {
    name: "Tout le monde connaît Juanita",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Piochez 2 cartes. Si vous avez 10 cartes ou plus dans votre défausse, piochez 3 cartes à la place.",
      },
    ],
  },
  it: {
    name: "Conosci Anche Tu Juanita",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Pesca 2 carte. Se hai 10 o più carte nei tuoi scarti, pesca invece 3 carte.",
      },
    ],
  },
  es: {
    name: "Everyone Knows Juanita",
    text: "Draw 2 cards. If you have 10 or more cards in your discard, draw 3 cards instead.",
  },
};
