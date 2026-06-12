import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rhinoPowerHamsterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rhino",
    version: "Power Hamster",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "EPIC BALL OF AWESOME",
        description: "While this character has no damage, he gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Dino",
    version: "Energiegeladener Hamster",
    text: [
      {
        title: "Gestaltwandel 2",
      },
      {
        title: "EPISCHER BALL DER GROSSARTIGKEIT",
        description:
          "Solange dieser Charakter unbeschädigt ist, erhält er Robust +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Rhino",
    version: "Hamster survolté",
    text: [
      {
        title: "Alter 2",
      },
      {
        title: "BOULE SUPER GÉNIALE",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne Résistance +2.",
      },
    ],
  },
  it: {
    name: "Rhino",
    version: "Criceto Potenziato",
    text: [
      {
        title: "Trasformazione 2",
      },
      {
        title: "PALLA EPICA",
        description: "E PAZZESCA Mentre questo personaggio non ha danno, ottiene Resistere +2.",
      },
    ],
  },
};
