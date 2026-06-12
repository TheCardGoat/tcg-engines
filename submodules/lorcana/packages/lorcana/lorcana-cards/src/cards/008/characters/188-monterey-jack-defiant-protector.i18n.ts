import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const montereyJackDefiantProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Monterey Jack",
    version: "Defiant Protector",
    text: "Bodyguard",
  },
  de: {
    name: "Samson",
    version: "Unbeugsamer Beschützer",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Jack le Costaud",
    version: "Protecteur intraitable",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Monterey Jack",
    version: "Protettore Spavaldo",
    text: "Guardiano",
  },
};
