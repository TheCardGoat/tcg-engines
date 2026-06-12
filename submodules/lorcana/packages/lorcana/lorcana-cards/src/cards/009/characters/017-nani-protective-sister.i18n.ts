import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const naniProtectiveSisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nani",
    version: "Protective Sister",
    text: "Bodyguard",
  },
  de: {
    name: "Nani",
    version: "Beschützende Schwester",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Nani",
    version: "Sœur protectrice",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Nani",
    version: "Sorella Protettiva",
    text: "Guardiano",
  },
};
