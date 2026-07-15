import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaMysticalMajestyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Mystical Majesty",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "EXCEPTIONAL POWER",
        description: "When you play this character, exert all opposing characters.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Geheimnisvolle Majestät",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Anna-Charaktere auszuspielen.)",
      },
      {
        title: "Besondere Macht",
        description: "Wenn du diesen Charakter ausspielst, erschöpfe alle gegnerischen Charaktere.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Majesté mystique",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Anna.)",
      },
      {
        title: "Pouvoir exceptionnel",
        description: "Lorsque vous jouez ce personnage, épuisez tous les personnages adverses.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Maestà Mistica",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Anna.)",
      },
      {
        title: "Potere Eccezionale",
        description: "Quando giochi questo personaggio, impegna tutti i personaggi avversari.",
      },
    ],
  },
};
