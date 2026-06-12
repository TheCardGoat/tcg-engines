import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const christopherRobinJoiningTheFunI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Christopher Robin",
    version: "Joining the Fun",
    text: [
      {
        title: "UNDERDOG",
        description:
          "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Christopher Robin",
    version: "Mit Spaß bei der Sache",
    text: [
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Jean-Christophe",
    version: "Se joint à la bataille",
    text: [
      {
        title: "OUTSIDER",
        description:
          "Jouer ce personnage vous coûte 1 de moins si c'est votre premier tour et que vous n'êtes pas le premier joueur.",
      },
    ],
  },
  it: {
    name: "Christopher Robin",
    version: "Che Si Unisce al Divertimento",
    text: [
      {
        title: "SFAVORITO",
        description:
          "Se questo è il tuo primo turno e non sei il primo giocatore, paga 1 in meno per giocare questo personaggio.",
      },
    ],
  },
};
