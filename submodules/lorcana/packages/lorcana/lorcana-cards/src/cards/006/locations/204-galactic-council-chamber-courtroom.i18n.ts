import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const galacticCouncilChamberCourtroomI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Galactic Council Chamber",
    version: "Courtroom",
    text: [
      {
        title: "FEDERATION DECREE",
        description:
          "While you have an Alien or Robot character here, this location can't be challenged.",
      },
    ],
  },
  de: {
    name: "Saal des Hohen Rats",
    version: "Gerichtssaal",
    text: [
      {
        title: "FÖDERATIONSERLASS",
        description:
          "Solange du mindestens einen Alien oder Roboter an diesem Ort hast, kann dieser Ort nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Chambre du Conseil galactique",
    version: "Salle d'audience",
    text: [
      {
        title: "DÉCRET DE LA FÉDÉRATION",
        description:
          "Tant que vous avez au moins un personnage Alien ou Robot sur ce lieu, ce lieu ne peut pas être défié.",
      },
    ],
  },
  it: {
    name: "Camera del Consiglio Galattico",
    version: "Aula di Tribunale",
    text: [
      {
        title: "DECRETO DELLA FEDERAZIONE",
        description:
          "Mentre hai un personaggio Alieno o Robot in questo luogo, questo luogo non può essere sfidato.",
      },
    ],
  },
};
