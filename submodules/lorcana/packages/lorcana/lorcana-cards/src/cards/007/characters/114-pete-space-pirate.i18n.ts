import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteSpacePirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Space Pirate",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "FRIGHTFUL SCHEME",
        description:
          "While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Weltraum-Pirat",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Kater-Karlo-Charaktere auszuspielen.)",
      },
      {
        title: "Schrecklicher Plan",
        description:
          "Solange dieser Charakter erschöpft ist, können gegnerische Charaktere nicht erschöpft werden, um Lieder zu singen, und deine Piraten erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Pirate de l'espace",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Pat.)",
      },
      {
        title: "Plan effroyable",
        description:
          "Tant que ce personnage est épuisé, les personnages adverses ne peuvent pas être épuisés pour chanter des chansons, et vos personnages Pirate gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Pirata Spaziale",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Gambadilegno.)",
      },
      {
        title: "Complotto Spaventoso",
        description:
          "Mentre questo personaggio è impegnato, i personaggi avversari non si possono impegnare per cantare canzoni e i tuoi personaggi Pirata ottengono <Resistere> +1.",
      },
    ],
  },
  es: {
    name: "Pete",
    version: "Pirata espacial",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "ESQUEMA ESPANTOSO",
        description:
          "Mientras este personaje está esforzado, los personajes contrarios no pueden esforzarse para cantar canciones y tus personajes Piratas obtienen Resistencia +1.",
      },
    ],
  },
};
