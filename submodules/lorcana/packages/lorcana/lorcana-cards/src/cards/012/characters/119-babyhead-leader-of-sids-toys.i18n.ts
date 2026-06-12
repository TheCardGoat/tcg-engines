import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const babyheadLeaderOfSidsToysI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Babyhead",
    version: "Leader of Sid's Toys",
    text: [
      {
        title: "Tighten the Bolts",
        description:
          "Whenever you pay 2 {I} or less to play a card, chosen character gets +2 {S} this turn.",
      },
      {
        title: "Replacement Parts",
        description:
          "During your turn, whenever one of your other characters is banished, draw a card.",
      },
    ],
  },
  de: {
    name: "Babykopf",
    version: "Anführer von Sids Spielzeugen",
    text: [
      {
        title: "Zieht die Schrauben fest",
        description:
          "Jedes Mal, wenn du 2 oder weniger {I} bezahlst, um eine Karte auszuspielen, erhält ein Charakter deiner Wahl in diesem Zug +2 {S}.",
      },
      {
        title: "Ersatzteile",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere in deinem Zug verbannt wird, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Tête de bébé",
    version: "Chef des jouets de Sid",
    text: [
      {
        title: "Serrez les vis",
        description:
          "Chaque fois que vous payez 2 {I} ou moins pour jouer une carte, choisissez un personnage qui gagne +2 {S} pour le reste de ce tour.",
      },
      {
        title: "Pièces de rechange",
        description:
          "Durant votre tour, chaque fois que l'un de vos autres personnages est banni, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Testa di Bebè",
    version: "Leader dei Giocattoli di Sid",
    text: [
      {
        title: "Stringere i Bulloni",
        description:
          "Ogni volta che paghi 2 {I} o meno per giocare una carta, un personaggio a tua scelta riceve +2 {S} per questo turno.",
      },
      {
        title: "Parti di Ricambio",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi altri personaggi viene esiliato, pesca una carta.",
      },
    ],
  },
};
