import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rajahDevotedProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rajah",
    version: "Devoted Protector",
    text: "Bodyguard",
  },
  de: {
    name: "Radsha",
    version: "Engagierter Beschützer",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Rajah",
    version: "Protecteur dévoué",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Rajah",
    version: "Protettore Devoto",
    text: "Guardiano",
  },
};
