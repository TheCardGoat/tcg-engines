import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyKluckProtectiveConfidantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady Kluck",
    version: "Protective Confidant",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Ward",
      },
    ],
  },
  de: {
    name: "Lady Gluck",
    version: "Beschützende Vertraute",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "<Behütet>",
      },
    ],
  },
  fr: {
    name: "Dame Gertrude",
    version: "Confidente protectrice",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "<Hors d'atteinte>",
      },
    ],
  },
  it: {
    name: "Lady Cocca",
    version: "Confidente Protettiva",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "<Protetto>",
      },
    ],
  },
  es: {
    name: "Señora kluck",
    version: "Confidente protector",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "Pabellón",
      },
    ],
  },
};
