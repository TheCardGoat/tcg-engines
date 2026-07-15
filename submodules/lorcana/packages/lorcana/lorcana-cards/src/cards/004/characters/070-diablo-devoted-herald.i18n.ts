import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const diabloDevotedHeraldI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Diablo",
    version: "Devoted Herald",
    text: [
      {
        title:
          "Shift: Discard an action card (You may discard an action card to play this on top of one of your characters named Diablo.)",
      },
      {
        title: "Evasive",
      },
      {
        title: "CIRCLE FAR AND WIDE",
        description:
          "During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Diablo",
    version: "Ergebener Bote",
    text: [
      {
        title:
          "<Gestaltwandel: Wirf 1 Aktionskarte ab> (Du kannst 1 Aktionskarte abwerfen, um diesen Charakter auf einen deiner Diablo-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Flieg weit hinaus",
        description:
          "Jedes Mal, wenn eine gegnerische Person in ihrem Zug 1 Karte zieht und dieser Charakter erschöpft ist, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Diablo",
    version: "Messager dévoué",
    text: [
      {
        title:
          "<Alter: Défaussez une carte Action> (Vous pouvez défausser une carte Action pour jouer ce personnage sur l'un de vos personnages Diablo.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Prends ton envol",
        description:
          "Tant que cette carte est épuisée, chaque fois qu'un adversaire pioche une carte durant son tour, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Diablo",
    version: "Araldo Devoto",
    text: [
      {
        title:
          "<Trasformazione: Scarta una carta azione> (Puoi scartare una carta azione per giocare questa carta sopra a uno dei tuoi personaggi chiamato Diablo.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Sorvola Tutta la Regione",
        description:
          "Durante il turno di ogni avversario, ogni volta che quell'avversario pesca una carta mentre questo personaggio è impegnato, puoi pescare una carta.",
      },
    ],
  },
};
