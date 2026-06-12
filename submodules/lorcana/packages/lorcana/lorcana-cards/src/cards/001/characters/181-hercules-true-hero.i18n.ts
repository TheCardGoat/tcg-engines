import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesTrueHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "True Hero",
    text: "Bodyguard",
  },
  de: {
    name: "Hercules",
    version: "Wahrer Held",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "HERCULE",
    version: "Vrai héros",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Hercules",
    version: "True Hero",
    text: [
      {
        title: "Bodyguard",
        description:
          "(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
};
