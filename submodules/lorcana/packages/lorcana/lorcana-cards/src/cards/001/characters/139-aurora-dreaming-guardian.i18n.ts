import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const auroraDreamingGuardianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aurora",
    version: "Dreaming Guardian",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "PROTECTIVE EMBRACE",
        description: "Your other characters gain Ward.",
      },
    ],
  },
  de: {
    name: "Aurora",
    version: "Wächterin der Träume",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Aurora Charaktere auszuspielen.)",
      },
      {
        title: "Schützende Umarmung",
        description:
          "Deine anderen Charaktere erhalten Behütet. (Gegnerische Karten können diese Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "AURORE",
    version: "Gardienne rêveuse",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur un autre personnage Aurore.)",
      },
      {
        title: "ÉTREINTE PROTECTRICE",
        description:
          "Vos autres personnages gagnent Hors d'atteinte. (Ils ne peuvent pas être choisis par vos adversaires, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Aurora",
    version: "Dreaming Guardian",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Aurora.)",
      },
      {
        title: "Protective Embrace",
        description:
          "Your other characters gain <Ward>. (Opponents can't choose them except to challenge.)",
      },
    ],
  },
  es: {
    name: "Aurora",
    version: "Guardián de los sueños",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "ABRAZO PROTECTOR",
        description: "Tus otros personajes ganan Ward.",
      },
    ],
  },
};
