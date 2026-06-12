import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const whiteRabbitLateAgainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "White Rabbit",
    version: "Late Again",
    text: [
      {
        title: "UNDERDOG",
        description:
          "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
      },
      {
        title: "Evasive",
      },
    ],
  },
  de: {
    name: "Weißes Kaninchen",
    version: "Wieder zu spät",
    text: [
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Wendig",
      },
    ],
  },
  fr: {
    name: "Le lapin blanc",
    version: "Encore en retard",
    text: [
      {
        title: "OUTSIDER",
        description:
          "Jouer ce personnage vous coûte 1 de moins si c'est votre premier tour et que vous n'êtes pas le premier joueur.",
      },
      {
        title: "Insaisissable",
      },
    ],
  },
  it: {
    name: "Bianconiglio",
    version: "Di Nuovo in Ritardo",
    text: [
      {
        title: "SFAVORITO",
        description:
          "Se questo è il tuo primo turno e non sei il primo giocatore, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Sfuggente",
      },
    ],
  },
};
