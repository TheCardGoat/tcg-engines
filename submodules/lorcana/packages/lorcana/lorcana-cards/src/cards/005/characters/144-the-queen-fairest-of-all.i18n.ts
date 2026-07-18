import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenFairestOfAllI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Fairest of All",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Ward",
      },
      {
        title: "REFLECTIONS OF VANITY",
        description:
          "For each other character named The Queen you have in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Die Schönste von allen",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Die-Königin-Charaktere auszuspielen.)",
      },
      {
        title: "<Behütet>",
      },
      {
        title: "Spiegelbilder der Eitelkeit",
        description:
          "Für jeden deiner anderen Die-Königin-Charaktere im Spiel, erhält dieser Charakter +1 {L}.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "La plus belle",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages La Reine.)",
      },
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Reflets de la vanité",
        description:
          "Pour chaque autre personnage La Reine que vous avez en jeu, ce personnage-ci gagne +1 {L}.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "La Più Bella del Reame",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Regina.)",
      },
      {
        title: "<Protetto>",
      },
      {
        title: "Riflessi di Vanità",
        description:
          "Per ogni altro personaggio chiamato Regina che hai in gioco, questo personaggio riceve +1 {L}.",
      },
    ],
  },
  es: {
    name: "La reina",
    version: "La más bella de todas",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Pabellón",
      },
      {
        title: "REFLEJOS DE VANIDAD",
        description:
          "Por cada otro personaje llamado La Reina que tengas en juego, este personaje obtiene +1 {L}.",
      },
    ],
  },
};
