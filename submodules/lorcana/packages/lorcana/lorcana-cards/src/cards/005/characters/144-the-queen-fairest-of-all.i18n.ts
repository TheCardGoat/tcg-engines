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
        title: "Gestaltwandel 3",
      },
      {
        title: "Behütet",
      },
      {
        title: "SPIEGELBILDER DER EITELKEIT",
        description:
          "Für jeden deiner anderen Die-Königin-Charaktere im Spiel, erhält dieser Charakter +1.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "La plus belle",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "Hors d'atteinte",
      },
      {
        title: "REFLETS DE LA VANITÉ",
        description:
          "Pour chaque autre personnage La Reine que vous avez en jeu, ce personnage-ci gagne +1.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "La Più Bella del Reame",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "Protetto",
      },
      {
        title: "RIFLESSI DI VANITÀ",
        description:
          "Per ogni altro personaggio chiamato Regina che hai in gioco, questo personaggio riceve +1.",
      },
    ],
  },
};
