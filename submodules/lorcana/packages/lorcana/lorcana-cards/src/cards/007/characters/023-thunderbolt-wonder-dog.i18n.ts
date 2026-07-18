import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thunderboltWonderDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Thunderbolt",
    version: "Wonder Dog",
    text: [
      {
        title: "Puppy Shift 3",
        description: "(You may pay 3 {I} to play this on top of one of your Puppy characters.)",
      },
      {
        title: "Bodyguard",
      },
    ],
  },
  de: {
    name: "Thunderbolt",
    version: "Wunderhund",
    text: [
      {
        title:
          "<Welpen-Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Welpen auszuspielen.)",
      },
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Ouragan",
    version: "Chien prodigieux",
    text: [
      {
        title:
          "<Alter de Chiot> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Chiot.)",
      },
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Fulmine",
    version: "Cane Prodigio",
    text: [
      {
        title:
          "<Trasformazione Cucciolo> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi Cucciolo.)",
      },
      {
        title: "<Guardiano>",
      },
    ],
  },
  es: {
    name: "Rayo",
    version: "Perro maravilla",
    text: [
      {
        title: "Cambio de cachorro 3",
        description: "(Puedes pagar 3 {I} para jugar esto encima de uno de tus personajes Puppy).",
      },
      {
        title: "Guardaespaldas",
      },
    ],
  },
};
