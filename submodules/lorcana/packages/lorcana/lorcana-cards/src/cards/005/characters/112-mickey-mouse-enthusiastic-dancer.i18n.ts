import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseEnthusiasticDancerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Enthusiastic Dancer",
    text: [
      {
        title: "PERFECT PARTNERS",
        description:
          "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Enthusiastischer Tänzer",
    text: [
      {
        title: "PERFEKTE PARTNER",
        description:
          "Solange du mindestens einen Minnie-Maus-Charakter im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Danseur enthousiaste",
    text: [
      {
        title: "CAVALIERS PARFAITS",
        description: "Tant que vous avez un personnage Minnie en jeu, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Ballerino Entusiasta",
    text: [
      {
        title: "PARTNER PERFETTI",
        description:
          "Mentre hai in gioco un personaggio chiamato Minni, questo personaggio riceve +2.",
      },
    ],
  },
};
