import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const itCallsMeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "It Calls Me",
    text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
  },
  de: {
    name: "Es ruft mich",
    text: "Ziehe 1 Karte. Mische danach bis zu 3 Karten deiner Wahl aus einem gegnerischen Ablagestapel zurück in das zugehörige Deck.",
  },
  fr: {
    name: "Il m'appelle",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 1 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Piochez une carte. Choisissez ensuite jusqu'à 3 cartes de la défausse d'un adversaire, puis remettez-les dans sa pioche et remélangez-la.",
      },
    ],
  },
  it: {
    name: "Per Nome",
    text: [
      {
        title:
          "(Un personaggio con costo 1 o superiore può {E} per giocare questa canzone gratis.)",
      },
      {
        title:
          "Pesca una carta. Dopodiché, scegli fino a 3 carte dagli scarti di un avversario a tua scelta e rimescolale nel suo mazzo.",
      },
    ],
  },
};
