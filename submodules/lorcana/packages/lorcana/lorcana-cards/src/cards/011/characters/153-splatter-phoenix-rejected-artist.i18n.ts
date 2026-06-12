import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const splatterPhoenixRejectedArtistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Splatter Phoenix",
    version: "Rejected Artist",
    text: [
      {
        title: "UNDERDOG",
        description:
          "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
      },
      {
        title: "Ward",
      },
    ],
  },
  de: {
    name: "Splatter Phoenix",
    version: "Zurückgewiesene Künstlerin",
    text: [
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Behütet",
      },
    ],
  },
  fr: {
    name: "Calamity Fresque",
    version: "Artiste rejetée",
    text: [
      {
        title: "OUTSIDER",
        description:
          "Jouer ce personnage vous coûte 1 de moins si c'est votre premier tour et que vous n'êtes pas le premier joueur.",
      },
      {
        title: "Hors d'atteinte",
      },
    ],
  },
  it: {
    name: "Miranda Van Quack",
    version: "Artista Incompresa",
    text: [
      {
        title: "SFAVORITO",
        description:
          "Se questo è il tuo primo turno e non sei il primo giocatore, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Protetto",
      },
    ],
  },
};
