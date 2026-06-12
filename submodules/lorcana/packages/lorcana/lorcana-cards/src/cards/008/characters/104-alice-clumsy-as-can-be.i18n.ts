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
        title: "Gestaltwandel 3",
      },
      {
        title: "UNFALLGEFÄHRDET",
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
        title: "Alter 3",
      },
      {
        title: "SUJETTE AUX ACCIDENTS",
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
        title: "Trasformazione 3",
      },
      {
        title: "PROPENSA AGLI INCIDENTI",
        description:
          "Ogni volta che questo personaggio va all'avventura, metti 1 segnalino danno su ogni altro personaggio.",
      },
    ],
  },
};
