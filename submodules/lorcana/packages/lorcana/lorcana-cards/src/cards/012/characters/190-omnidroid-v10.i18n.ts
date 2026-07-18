import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const omnidroidV10I18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Omnidroid",
    version: "V.10",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "ELECTRO-ARMOR",
        description: "While there's a card under this character, it gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Omnidroid",
    version: "V.10",
    text: [
      {
        title:
          "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Omnidroid-Charaktere auszuspielen.)",
      },
      {
        title: "Elektrorüstung",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er <Robust> +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Omnidroïde",
    version: "V.10",
    text: [
      {
        title:
          "<Alter> 4 {I} (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages nommé Omnidroïde.)",
      },
      {
        title: "Électro-armure",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne <Résistance> +2.",
      },
    ],
  },
  it: {
    name: "Omnidroide",
    version: "V.10",
    text: [
      {
        title:
          "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Omnidroide.)",
      },
      {
        title: "Armatura Elettrica",
        description: "Mentre c'è una carta sotto a questo personaggio, ottiene <Resistere> +2.",
      },
    ],
  },
  es: {
    name: "Omnidroide",
    version: "V.10",
    text: [
      {
        title: "Cambio 4 {I}",
      },
      {
        title: "ELECTRO-ARMADURA",
        description: "Mientras haya una carta debajo de este personaje, gana Resistencia +2.",
      },
    ],
  },
};
