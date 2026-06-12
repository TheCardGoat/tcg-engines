import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const joshuaSweetTheDoctorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Joshua Sweet",
    version: "The Doctor",
    text: "Bodyguard",
  },
  de: {
    name: "Joshua Sweet",
    version: "Der Arzt",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Amadou Gentil",
    version: "Le docteur",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Joshua Dolce",
    version: "Il Dottore",
    text: "Guardiano",
  },
};
