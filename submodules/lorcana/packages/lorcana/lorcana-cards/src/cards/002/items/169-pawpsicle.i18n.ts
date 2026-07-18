import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pawpsicleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pawpsicle",
    text: [
      {
        title: "JUMBO POP",
        description: "When you play this item, you may draw a card.",
      },
      {
        title: "THAT'S REDWOOD",
        description: "Banish this item — Remove up to 2 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Tatziatella",
    text: [
      {
        title: "Jumbo-Pop",
        description: "Wenn du diesen Gegenstand ausspielst, darfst du 1 Karte ziehen.",
      },
      {
        title: "Das ist Kirschholz",
        description:
          "Verbanne diesen Gegenstand — Entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Glace à l'eau",
    text: [
      {
        title: "Jumbo Pop",
        description: "Lorsque vous jouez cet objet, vous pouvez piocher une carte.",
      },
      {
        title: "C'est du bâton rouge",
        description:
          "Bannissez cet objet — Choisissez un personnage et retirez-lui jusqu'à 2 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Pawpsicle",
    text: [
      {
        title: "Jumbo Pop",
        description: "When you play this item, you may draw a card.",
      },
      {
        title: "That's Redwood",
        description: "Banish this item — Remove up to 2 damage from chosen character.",
      },
    ],
  },
  es: {
    name: "Patapsícula",
    text: [
      {
        title: "POP GRANDE",
        description: "Cuando juegas este objeto, puedes robar una carta.",
      },
      {
        title: "ESO ES SECOYA",
        description: "Desterrar este objeto: elimina hasta 2 puntos de daño del personaje elegido.",
      },
    ],
  },
};
