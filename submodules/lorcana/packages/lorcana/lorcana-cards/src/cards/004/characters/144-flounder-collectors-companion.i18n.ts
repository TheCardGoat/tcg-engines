import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flounderCollectorsCompanionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flounder",
    version: "Collector’s Companion",
    text: [
      {
        title: "Support",
      },
      {
        title: "I'M NOT A GUPPY",
        description:
          "If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Fabius",
    version: "Begleiter der Sammlerin",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "ICH BIN KEINE KAULQUAPPE",
        description:
          "Wenn du einen Arielle-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Polochon",
    version: "Compagnon de la collectionneuse",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "JE NE SUIS PAS UN POISSON-LUNE",
        description:
          "Si vous avez un personnage Ariel en jeu, jouer ce personnage coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Flounder",
    version: "Compagno della Collezionista",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "NON SONO UN PESCE ROSSO",
        description:
          "Se hai in gioco un personaggio chiamato Ariel, paga 1 in meno per giocare questo personaggio.",
      },
    ],
  },
};
