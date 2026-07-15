import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fredGiantsizedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fred",
    version: "Giant-Sized",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "I LIKE WHERE THIS IS HEADING",
        description:
          "Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
      },
    ],
  },
  de: {
    name: "Fred",
    version: "Riesengroß",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Fred-Charaktere auszuspielen.)",
      },
      {
        title: "Jetzt wird's total krass",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, decke so lange die oberste Karte deines Decks auf, bis du eine Flutgestalt-Charakterkarte aufdeckst. Nimm jene auf deine Hand und mische die restlichen aufgedeckten Karten in dein Deck.",
      },
    ],
  },
  fr: {
    name: "Fred",
    version: "Version géante",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Fred.)",
      },
      {
        title: "J'adore, ça s'annonce bien",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, révélez des cartes du dessus de votre pioche jusqu'à révéler une carte Personnage Floodborn. Mettez cette carte dans votre main et mélangez les autres cartes révélées dans votre pioche.",
      },
    ],
  },
  it: {
    name: "Fred",
    version: "Gigantesco",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Fred.)",
      },
      {
        title: "La Cosa si Fa Interessante",
        description:
          "Ogni volta che questo personaggio va all'avventura, rivela carte dalla cima del tuo mazzo finché non riveli una carta personaggio Imbevuto. Aggiungi quella carta alla tua mano e rimescola il resto nel tuo mazzo.",
      },
    ],
  },
};
