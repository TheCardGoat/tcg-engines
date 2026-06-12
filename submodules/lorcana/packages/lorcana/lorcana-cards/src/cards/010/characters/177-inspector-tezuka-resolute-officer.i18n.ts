import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const inspectorTezukaResoluteOfficerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Inspector Tezuka",
    version: "Resolute Officer",
    text: "Bodyguard",
  },
  de: {
    name: "Inspektorin Tezuka",
    version: "Beharrliche Polizistin",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Inspectrice Tezuka",
    version: "Officière résolue",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Ispettrice Tezuka",
    version: "Agente Risoluta",
    text: "Guardiano",
  },
};
