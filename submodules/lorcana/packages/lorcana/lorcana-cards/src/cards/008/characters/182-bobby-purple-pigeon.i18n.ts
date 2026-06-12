import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bobbyPurplePigeonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bobby",
    version: "Purple Pigeon",
    text: "Bodyguard",
  },
  de: {
    name: "Bobby",
    version: "Lila Taube",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Bobby le pigeon",
    version: "Pigeon violet",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Bobby",
    version: "Piccione Viola",
    text: "Guardiano",
  },
};
