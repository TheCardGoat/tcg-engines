import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fixitFelixJrTrustyBuilderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fix-It Felix, Jr.",
    version: "Trusty Builder",
    text: "Bodyguard",
  },
  de: {
    name: "Fix-It Felix, Jr.",
    version: "Zuverlässiger Erbauer",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Félix Fixe Junior",
    version: "Constructeur fiable",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Felix Aggiustatutto Jr.",
    version: "Costruttore Fidato",
    text: "Guardiano",
  },
};
