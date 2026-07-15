import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nickWildeSlyFoxI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nick Wilde",
    version: "Sly Fox",
    text: [
      {
        title: "Shift 1",
      },
      {
        title: "CAN'T TOUCH ME",
        description: "While you have an item in play, this character can't be challenged.",
      },
    ],
  },
  de: {
    name: "Nick Wilde",
    version: "Schlitzohr",
    text: [
      {
        title:
          "<Gestaltwandel> 1 (Du kannst 1 {I} zahlen, um diesen Charakter auf einen deiner Nick-Wilde-Charaktere auszuspielen.)",
      },
      {
        title: "Du kannst mir nichts anhaben",
        description:
          "Solange du mindestens einen Gegenstand im Spiel hast, kann dieser Charakter nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Nick Wilde",
    version: "Renard narquois",
    text: [
      {
        title:
          "<Alter> 1 (Vous pouvez payer 1 {I} pour jouer ce personnage sur l'un de vos personnages Nick Wilde.)",
      },
      {
        title: "Tu m'auras pas",
        description: "Tant que vous avez un objet en jeu, ce personnage ne peut pas être défié.",
      },
    ],
  },
  it: {
    name: "Nick Wilde",
    version: "Volpe Acuta",
    text: [
      {
        title:
          "<Trasformazione> 1 (Puoi pagare 1 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Nick Wilde.)",
      },
      {
        title: "Non Puoi Toccarmi",
        description: "Mentre hai in gioco un oggetto, questo personaggio non può essere sfidato.",
      },
    ],
  },
};
