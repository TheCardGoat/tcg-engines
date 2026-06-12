import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const simbaProtectiveCubI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Simba",
    version: "Protective Cub",
    text: "Bodyguard",
  },
  de: {
    name: "Simba",
    version: "Schützender Welpe",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "SIMBA",
    version: "Lionceau protecteur",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Simba",
    version: "Protective Cub",
    text: [
      {
        title: "Bodyguard",
        description:
          "(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
};
