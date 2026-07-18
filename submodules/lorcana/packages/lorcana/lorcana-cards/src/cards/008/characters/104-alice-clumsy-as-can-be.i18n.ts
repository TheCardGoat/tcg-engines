import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceClumsyAsCanBeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Clumsy as Can Be",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "ACCIDENT PRONE",
        description:
          "Whenever this character quests, put 1 damage counter on each other character.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Ungeschickt wie immer",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Alice-Charaktere auszuspielen.)",
      },
      {
        title: "Unfallgefährdet",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, lege 1 Schadensmarker auf alle anderen Charaktere.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Maladroite au possible",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Alice.)",
      },
      {
        title: "Sujette aux accidents",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, placez 1 dommage sur chaque autre personnage.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Estremamente Goffa",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Alice.)",
      },
      {
        title: "Propensa agli Incidenti",
        description:
          "Ogni volta che questo personaggio va all'avventura, metti 1 segnalino danno su ogni altro personaggio.",
      },
    ],
  },
  es: {
    name: "Alicia",
    version: "Tan torpe como puede ser",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "PROPENSO A ACCIDENTES",
        description:
          "Siempre que este personaje realice una misión, pon 1 contador de daño en cada uno de los demás personajes.",
      },
    ],
  },
};
