import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chienpoImperialSoldierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chien-Po",
    version: "Imperial Soldier",
    text: "Bodyguard",
  },
  de: {
    name: "Chien-Po",
    version: "Soldat des Kaisers",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Chien-Po",
    version: "Soldat Impérial",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Chien-Po",
    version: "Soldato Imperiale",
    text: "Guardiano",
  },
};
