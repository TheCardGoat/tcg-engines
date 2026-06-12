import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liquidatorIcedOverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Liquidator",
    version: "Iced Over",
    text: [
      {
        title: "UNDERDOG",
        description:
          "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
      },
      {
        title: "Reckless",
      },
    ],
  },
  de: {
    name: "Liquidator",
    version: "Vereist",
    text: [
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Impulsiv",
      },
    ],
  },
  fr: {
    name: "Liquidator",
    version: "Couvert de glace",
    text: [
      {
        title: "OUTSIDER",
        description:
          "Jouer ce personnage vous coûte 1 de moins si c'est votre premier tour et que vous n'êtes pas le premier joueur.",
      },
      {
        title: "Combattant",
      },
    ],
  },
  it: {
    name: "Liquidator",
    version: "Congelato",
    text: [
      {
        title: "SFAVORITO",
        description:
          "Se questo è il tuo primo turno e non sei il primo giocatore, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Attaccabrighe",
      },
    ],
  },
};
