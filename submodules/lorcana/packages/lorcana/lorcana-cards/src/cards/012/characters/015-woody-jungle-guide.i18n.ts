import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const woodyJungleGuideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Woody",
    version: "Jungle Guide",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "LET'S GET MOVIN'",
        description:
          "Whenever this character quests, draw a card. Then, you may play a character with cost 2 or less for free.",
      },
      {
        title: "EVERYONE GATHER 'ROUND",
        description: "Your other Toy characters get +1 {W}.",
      },
    ],
  },
  de: {
    name: "Woody",
    version: "Dschungelführer",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Woody-Charaktere auszuspielen.)",
      },
      {
        title: "Los geht's",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, ziehe 1 Karte. Danach darfst du einen Charakter, der 2 oder weniger kostet, kostenlos ausspielen.",
      },
      {
        title: "Versammelt euch",
        description: "Deine anderen Spielzeuge erhalten +1 {W}.",
      },
    ],
  },
  fr: {
    name: "Woody",
    version: "Guide de la jungle",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Woody.)",
      },
      {
        title: "Allons-y!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, piochez une carte. Ensuite, vous pouvez jouer gratuitement un personnage coûtant 2 ou moins.",
      },
      {
        title: "Que tout le monde se rassemble",
        description: "Vos autres personnages Jouet gagnent +1 {W}.",
      },
    ],
  },
  it: {
    name: "Woody",
    version: "Guida della Giungla",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Woody.)",
      },
      {
        title: "Muoviamoci",
        description:
          "Ogni volta che questo personaggio va all'avventura, pesca una carta. Poi, puoi giocare un personaggio con costo 2 o inferiore gratis.",
      },
      {
        title: "Avvicinatevi tutti",
        description: "I tuoi altri personaggi Giocattolo ricevono +1 {W}.",
      },
    ],
  },
};
