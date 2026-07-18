import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theGlassSlipperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Glass Slipper",
    text: [
      {
        title: "PERFECT PAIR",
        description: "You may only have 2 copies of The Glass Slipper in your deck.",
      },
      {
        title: "SEARCH THE KINGDOM",
        description:
          "Banish this item, {E} one of your Prince characters — Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
      },
    ],
  },
  de: {
    name: "Der gläserne Schuh",
    text: [
      {
        title: "Perfektes Paar",
        description: "Dein Deck darf nur 2 Der-gläserne-Schuh-Karten enthalten.",
      },
      {
        title: "Durchsuche das Königreich",
        description:
          "Verbanne diesen Gegenstand, {E} einen deiner Prinzen — Durchsuche dein Deck nach einer Prinzessinnen-Charakterkarte und zeige diese allen Mitspielenden. Nimm die Karte auf deine Hand und mische danach dein Deck.",
      },
    ],
  },
  fr: {
    name: "La Pantoufle de verre",
    text: [
      {
        title: "La paire parfaite",
        description:
          "Vous ne pouvez avoir au maximum que 2 exemplaires de La Pantoufle de Verre dans votre deck.",
      },
      {
        title: "Chercher dans tout le royaume",
        description:
          "Bannissez cet objet, {E} l'un de vos personnages Prince — Cherchez une carte Personnage Princesse dans votre deck et révélez-la à tous les joueurs. Placez la carte révélée dans votre main et mélangez votre pioche.",
      },
    ],
  },
  it: {
    name: "La Scarpetta di Cristallo",
    text: [
      {
        title: "Paio Perfetto",
        description: "Puoi avere solo 2 copie de La Scarpetta di Cristallo nel tuo mazzo.",
      },
      {
        title: "Cercate in Tutto il Regno",
        description:
          "Esilia questo oggetto, {E} uno dei tuoi personaggi Principe — Cerca una carta personaggio Principessa nel tuo mazzo e rivelala a tutti i giocatori. Aggiungi quella carta alla tua mano e rimescola il tuo mazzo.",
      },
    ],
  },
  es: {
    name: "La zapatilla de cristal",
    text: [
      {
        title: "PAR PERFECTO",
        description: "Solo puedes tener 2 copias de The Glass Slipper en tu mazo.",
      },
      {
        title: "BUSCAR EL REINO",
        description:
          "Destierra este objeto, {E} uno de tus personajes Príncipe: busca en tu mazo una carta de personaje Princesa y muéstrala a todos los jugadores. Pon esa carta en tu mano y baraja tu mazo.",
      },
    ],
  },
};
