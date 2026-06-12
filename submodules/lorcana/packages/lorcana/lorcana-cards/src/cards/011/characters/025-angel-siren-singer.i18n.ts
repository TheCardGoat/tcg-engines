import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const angelSirenSingerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Angel",
    version: "Siren Singer",
    text: [
      {
        title: "UNDERDOG",
        description:
          "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
      },
      {
        title: "Singer 3",
      },
    ],
  },
  de: {
    name: "Engel",
    version: "Sirenen-Sängerin",
    text: [
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Singen 3",
      },
    ],
  },
  fr: {
    name: "Angel",
    version: "Chanteuse sirène",
    text: [
      {
        title: "OUTSIDER",
        description:
          "Jouer ce personnage vous coûte 1 de moins si c'est votre premier tour et que vous n'êtes pas le premier joueur.",
      },
      {
        title: "Mélomane 3",
      },
    ],
  },
  it: {
    name: "Angel",
    version: "Dal Canto di Sirena",
    text: [
      {
        title: "SFAVORITO",
        description:
          "Se questo è il tuo primo turno e non sei il primo giocatore, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Melodioso 3",
      },
    ],
  },
};
