import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heiheiProtectiveRoosterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "HeiHei",
    version: "Protective Rooster",
    text: "Bodyguard",
  },
  de: {
    name: "HeiHei",
    version: "Schützender Hahn",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Heihei",
    version: "Coq de protection",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Heihei",
    version: "Galletto Protettivo",
    text: "Guardiano",
  },
};
