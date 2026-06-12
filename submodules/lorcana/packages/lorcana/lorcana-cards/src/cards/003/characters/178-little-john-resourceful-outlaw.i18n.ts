import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const littleJohnResourcefulOutlawI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Little John",
    version: "Resourceful Outlaw",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "OKAY, BIG SHOT",
        description:
          "While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
      },
    ],
  },
  de: {
    name: "Little John",
    version: "Raffinierter Gesetzloser",
    text: [
      {
        title: "Gestaltwandel 4",
      },
      {
        title: "DEIN GLÜCK, DU KNILCH",
        description:
          "Solange dieser Charakter erschöpft ist, erhalten deine Charaktere mit Beschützen +1 und Robust +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Petit Jean",
    version: "Hors-la-loi plein de ressources",
    text: [
      {
        title: "Alter 4",
      },
      {
        title: "C'EST ÇA, GRAND CHEF",
        description:
          "Tant que ce personnage est épuisé, vos personnages avec Rempart gagnent +1 et Résistance +1.",
      },
    ],
  },
  it: {
    name: "Little John",
    version: "Fuorilegge Intraprendente",
    text: [
      {
        title: "Trasformazione 4",
      },
      {
        title: "OK, BUFFONE",
        description:
          "Mentre questo personaggio è impegnato, i tuoi personaggi con Guardiano ottengono Resistere +1 e ricevono +1.",
      },
    ],
  },
};
