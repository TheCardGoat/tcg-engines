import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesBelovedHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Beloved Hero",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Resist +1",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Geliebter Held",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Héros bien-aimé",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "<Résistance> +1",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Beneamato Eroe",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "<Resistere> +1",
      },
    ],
  },
};
