import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinHoodChampionOfSherwoodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin Hood",
    version: "Champion of Sherwood",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "SKILLED COMBATANT",
        description:
          "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      },
      {
        title: "THE GOOD OF OTHERS",
        description: "When this character is banished in a challenge, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Robin Hood",
    version: "Champion von Sherwood",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Robin-Hood-Charaktere auszuspielen.)",
      },
      {
        title: "Erfahrener Kämpfer",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden.",
      },
      {
        title: "Das Wohl der anderen",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Champion de Sherwood",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Robin des Bois.)",
      },
      {
        title: "Combattant émérite",
        description:
          "Chaque fois que ce personnage en bannit un autre via un défi durant votre tour, gagnez 2 éclats de Lore.",
      },
      {
        title: "Pour le bien d'autrui",
        description: "Si ce personnage est banni via un défi, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Campione di Sherwood",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Robin Hood.)",
      },
      {
        title: "Combattente Esperto",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, ottieni 2 leggenda.",
      },
      {
        title: "Per il Bene degli Altri",
        description:
          "Quando questo personaggio viene esiliato in una sfida, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Robin Hood",
    version: "Campeón de Sherwood",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "COMBATIENTE HABILIDADO",
        description:
          "Durante tu turno, cada vez que este personaje destierre a otro personaje en un desafío, gana 2 conocimientos.",
      },
      {
        title: "EL BIEN DE LOS DEMAS",
        description: "Cuando este personaje es desterrado en un desafío, puedes robar una carta.",
      },
    ],
  },
};
