import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const balooVonBruinwaldXiiiI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baloo",
    version: "von Bruinwald XIII",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "LET'S MAKE LIKE",
        description: "A TREE When this character is banished, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Balu",
    version: "von Bruinwald XIII",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Ab durch die nasse Mitte",
        description: "Wenn dieser Charakter verbannt wird, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Baloo",
    version: "von Bruinwald XIII",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Moi, je me jette à l'eau",
        description: "Lorsque ce personnage est banni, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Baloo",
    version: "Von Bruinwald XIII",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Allontaniamoci, Svelti!",
        description: "Quando questo personaggio viene esiliato, ottieni 2 leggenda.",
      },
    ],
  },
};
