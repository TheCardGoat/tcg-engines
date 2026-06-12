import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mchornIcecoldOfficerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "McHorn",
    version: "Ice-Cold Officer",
    text: "Bodyguard",
  },
  de: {
    name: "McHorn",
    version: "Eiskalter Offizier",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "McCorne",
    version: "Policier glacial",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "McHorn",
    version: "Agente Gelido",
    text: "Guardiano",
  },
};
