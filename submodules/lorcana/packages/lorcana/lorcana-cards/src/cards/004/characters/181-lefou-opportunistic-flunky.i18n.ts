import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lefouOpportunisticFlunkyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "LeFou",
    version: "Opportunistic Flunky",
    text: [
      {
        title: "I LEARNED FROM THE BEST",
        description:
          "During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
      },
    ],
  },
  de: {
    name: "Le Fou",
    version: "Beeinflussbarer Lakai",
    text: [
      {
        title: "ICH HABE VOM BESTEN GELERNT",
        description:
          "In deinem Zug kannst du diesen Charakter kostenlos ausspielen, wenn ein gegnerischer Charakter in diesem Zug durch eine Herausforderung verbannt wurde.",
      },
    ],
  },
  fr: {
    name: "Le Fou",
    version: "Laquais opportuniste",
    text: [
      {
        title: "J'AI APPRIS AUPRÈS DU MEILLEUR",
        description:
          "Durant votre tour, si un personnage adverse a été banni via un défi, vous pouvez jouer ce personnage gratuitement.",
      },
    ],
  },
  it: {
    name: "Le Tont",
    version: "Lacchè Opportunista",
    text: [
      {
        title: "HO IMPARATO DAL MIGLIORE",
        description:
          "Durante il tuo turno, puoi giocare questo personaggio gratis se un personaggio avversario è stato esiliato in una sfida in questo turno.",
      },
    ],
  },
};
