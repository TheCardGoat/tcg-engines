import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrIncredibleSuperStrongI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mr. Incredible",
    version: "Super Strong",
    text: [
      {
        title: "Shift 3 {I}",
        description:
          "(You may pay 3 {I} to play this on top of one of your characters named Mr. Incredible.)",
      },
      {
        title: "ALWAYS UNITED",
        description: "This character gets +2 {S} for each other character you have in play.",
      },
      {
        title: "LET'S DO THIS!",
        description:
          "Whenever one of your Super characters challenges another character, draw a card.",
      },
    ],
  },
  de: {
    name: "Mr. Incredible",
    version: "Superstark",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Mr.-Incredible-Charaktere auszuspielen.)",
      },
      {
        title: "Immer vereint",
        description: "Dieser Charakter erhält +2 {S} für jeden deiner anderen Charaktere im Spiel.",
      },
      {
        title: "Packen wir's an!",
        description:
          "Jedes Mal, wenn einer deiner Super einen anderen Charakter herausfordert, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "M. Indestructible",
    version: "Super fort",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé M. Indestructible.)",
      },
      {
        title: "Toujours unis",
        description:
          "Ce personnage gagne +2 {S} pour chaque autre personnage que vous avez en jeu.",
      },
      {
        title: "C'est parti!",
        description:
          "Chaque fois que l'un de vos personnages Super défie un autre personnage, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Mr. Incredibile",
    version: "Super Forte",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Mr. Incredibile.)",
      },
      {
        title: "Sempre Uniti",
        description:
          "Questo personaggio riceve +2 {S} per ogni altro personaggio che hai in gioco.",
      },
      {
        title: "Diamoci Dentro!",
        description:
          "Ogni volta che uno dei tuoi personaggi Super sfida un altro personaggio, pesca una carta.",
      },
    ],
  },
};
