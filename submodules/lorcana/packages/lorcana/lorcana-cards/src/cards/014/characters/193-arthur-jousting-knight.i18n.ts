import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arthurJoustingKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Arthur",
    version: "Jousting Knight",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "Challenger +2",
      },
      {
        title: "VICTORY PURSE",
        description:
          "During your turn, whenever this character banishes another character in a challenge, draw a card and get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      },
    ],
  },
  de: {
    name: "Arthur",
    version: "Turnierritter",
    text: [
      {
        title:
          "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Arthur auszuspielen.)",
      },
      {
        title: "<Herausfordern> +2 (Während dieser Charakter herausfordert, erhält er +2 {S}.)",
      },
      {
        title: "Siegesprämie",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, ziehe 1 Karte und erschaffe 1 Tintentropfen. (Ein Tintentropfen kann entfernt werden, um 1 {I} zu bezahlen.)",
      },
    ],
  },
  fr: {
    name: "Arthur",
    version: "Chevalier jouteur",
    text: [
      {
        title:
          "<Alter> 4 {I} (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages nommé Arthur.)",
      },
      {
        title: "<Offensif> +2",
      },
      {
        title: "Bourse de la victoire",
        description:
          "Durant votre tour, chaque fois que ce personnage en bannit un autre via un défi, piochez une carte et gagnez 1 goutte d'encre. (Vous pouvez retirer l'une de vos gouttes d'encre pour payer 1 {I}.)",
      },
    ],
  },
  it: {
    name: "Artù",
    version: "Cavaliere da Giostra",
    text: [
      {
        title:
          "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Artù.)",
      },
      {
        title: "<Sfidante> +2",
      },
      {
        title: "Bottino della Vittoria",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, pesca una carta e ricevi 1 goccia d'inchiostro. (Puoi rimuovere una goccia d'inchiostro per pagare 1 {I}.)",
      },
    ],
  },
  es: {
    name: "Arthur",
    version: "Jousting Knight",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "Challenger +2",
      },
      {
        title: "VICTORY PURSE",
        description:
          "During your turn, whenever this character banishes another character in a challenge, draw a card and get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      },
    ],
  },
};
