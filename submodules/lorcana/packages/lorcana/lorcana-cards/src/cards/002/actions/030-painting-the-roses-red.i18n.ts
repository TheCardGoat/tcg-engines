import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const paintingTheRosesRedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Painting the Roses Red",
    text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
  },
  de: {
    name: "Wir malen die Rosen rot",
    text: [
      {
        title: "Gib bis zu 2 Charakteren deiner Wahl in diesem Zug jeweils -1 {S}.",
      },
      {
        title: "Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Peignons les roses en rouge",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez jusqu'à 2 personnages, ils subissent -1 {S} pour le reste de ce tour. Piochez 1 carte.",
      },
    ],
  },
  it: {
    name: "Painting the Roses Red",
    text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
  },
  es: {
    name: "Pintar las rosas de rojo",
    text: "Hasta 2 personajes elegidos obtienen -1 {S} este turno. Saca una carta.",
  },
};
