import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theFrozenVineMonstrousPlantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Frozen Vine",
    version: "Monstrous Plant",
    text: [
      {
        title: "PERSISTENT PROBLEM",
        description:
          "When this location is banished, if there was an exerted character here, return this card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Die gefrorene Ranke",
    version: "Monströse Pflanze",
    text: [
      {
        title: "HARTNÄCKIGES PROBLEM",
        description:
          "Wenn dieser Ort verbannt wird, falls du mindestens einen erschöpften Charakter an diesem Ort hattest, nimm diese Karte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "La Plante gelée",
    version: "Monstrueux végétal",
    text: [
      {
        title: "PROBLÈME PERSISTANT",
        description:
          "Lorsque ce lieu est banni, s'il y avait un personnage épuisé sur lui, renvoyez dans votre main cette carte-ci de votre défausse.",
      },
    ],
  },
  it: {
    name: "Il Viticcio Congelato",
    version: "Pianta Mostruosa",
    text: [
      {
        title: "PROBLEMA PERSISTENTE",
        description:
          "Quando questo luogo viene esiliato, se c'era un personaggio impegnato in questo luogo, riprendi in mano questa carta dai tuoi scarti.",
      },
    ],
  },
};
