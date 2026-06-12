import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const seekingTheHalfCrownI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Seeking the Half Crown",
    text: [
      {
        title:
          "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.",
      },
      {
        title: "Draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Nach der Kronenhälfte suchen",
    text: "Für jeden Magier, den du im Spiel hast, zahlst du 1 weniger, um diese Aktion auszuspielen. Ziehe 2 Karten.",
  },
  fr: {
    name: "En quête de la moitié de Couronne",
    text: "Jouer cette action coûte 1 de moins pour chaque personnage Mage que vous avez en jeu. Piochez 2 cartes.",
  },
  it: {
    name: "Alla Ricerca della Mezza Corona",
    text: "Per ogni personaggio Incantatore che hai in gioco, paga 1 in meno per giocare questa azione. Pesca 2 carte.",
  },
};
