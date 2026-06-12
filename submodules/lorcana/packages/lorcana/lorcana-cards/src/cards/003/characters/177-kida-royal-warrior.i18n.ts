import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kidaRoyalWarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kida",
    version: "Royal Warrior",
    text: "Bodyguard",
  },
  de: {
    name: "Kida",
    version: "Königliche Kriegerin",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Kida",
    version: "Guerrière royale",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Kida",
    version: "Guerriera Reale",
    text: "Guardiano",
  },
};
