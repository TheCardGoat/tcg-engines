import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastFierceDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Fierce Defender",
    text: [
      {
        title: "Formidable Love",
        description: "While you have a character named Belle in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Furchtloser Verteidiger",
    text: [
      {
        title: "Ungeheure Liebe",
        description:
          "Solange du mindestens einen Charakter namens Belle im Spiel hast, erhält dieser Charakter +2 {S}.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Défenseur féroce",
    text: [
      {
        title: "Amour farouche",
        description:
          "Tant que vous avez un personnage nommé Belle en jeu, ce personnage-ci gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "La Bestia",
    version: "Difensore Feroce",
    text: [
      {
        title: "Amore Formidabile",
        description:
          "Mentre hai in gioco un personaggio chiamato Belle, questo personaggio riceve +2 {S}.",
      },
    ],
  },
};
