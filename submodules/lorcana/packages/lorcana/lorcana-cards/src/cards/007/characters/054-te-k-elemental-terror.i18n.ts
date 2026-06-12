import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const teKElementalTerrorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Te Kā",
    version: "Elemental Terror",
    text: [
      {
        title: "Shift 7",
      },
      {
        title: "ANCIENT RAGE",
        description: "During your turn, whenever an opposing character is exerted, banish them.",
      },
    ],
  },
  de: {
    name: "Te Kā",
    version: "Elementarer Terror",
    text: [
      {
        title: "Gestaltwandel 7",
      },
      {
        title: "ALTER ZORN",
        description:
          "Jedes Mal während deines Zuges, wenn ein gegnerischer Charakter erschöpft wird, verbanne ihn.",
      },
    ],
  },
  fr: {
    name: "TE KĀ",
    version: "Terreur élémentaire",
    text: [
      {
        title: "Alter 7",
      },
      {
        title: "RAGE ANCESTRALE",
        description:
          "Durant votre tour, chaque fois qu'un personnage adverse devient épuisé, bannissez-le.",
      },
    ],
  },
  it: {
    name: "Te Kā",
    version: "Terrore Elementale",
    text: [
      {
        title: "Trasformazione 7",
      },
      {
        title: "RABBIA ANTICA",
        description:
          "Durante il tuo turno, ogni volta che un personaggio avversario viene impegnato, esilialo.",
      },
    ],
  },
};
