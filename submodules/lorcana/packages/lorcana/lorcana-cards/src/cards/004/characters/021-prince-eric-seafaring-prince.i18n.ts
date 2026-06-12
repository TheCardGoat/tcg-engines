import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeEricSeafaringPrinceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Eric",
    version: "Seafaring Prince",
    text: [
      {
        title: "Bodyguard",
        description:
          "(This character may enter play exerted. An opposing character who challenges one of your characters must choose a character with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Prinz Eric",
    version: "Seefahrer Prinz",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Prince Eric",
    version: "Prince navigateur",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Principe Eric",
    version: "Principe Navigatore",
    text: "Guardiano",
  },
};
