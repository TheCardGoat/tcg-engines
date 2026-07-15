import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const namaariMorningMistEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Namaari",
    version: "Morning Mist",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "BLADES",
        description: "This character can challenge ready characters.",
      },
    ],
  },
  de: {
    name: "Namaari",
    version: "Morgennebel",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Die Klinge",
        description: "Dieser Charakter kann bereite Charaktere herausfordern.",
      },
    ],
  },
  fr: {
    name: "Namaari",
    version: "Brume matinale",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Lames",
        description: "Ce personnage peut défier des personnages redressés.",
      },
    ],
  },
  it: {
    name: "Namaari",
    version: "Morning Mist",
    text: [
      {
        title:
          "<Bodyguard> (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
      {
        title: "Blades",
        description: "This character can challenge ready characters.",
      },
    ],
  },
};
