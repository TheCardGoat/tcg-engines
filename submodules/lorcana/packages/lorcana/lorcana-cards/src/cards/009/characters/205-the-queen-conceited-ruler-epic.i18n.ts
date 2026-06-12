import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenConceitedRulerEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Conceited Ruler",
    text: [
      {
        title: "Support",
      },
      {
        title: "ROYAL SUMMONS",
        description:
          "At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Eingebildete Herrscherin",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "KÖNIGLICHE VORLADUNG",
        description:
          "Zu Beginn deines Zuges darfst du eine Prinzessinnen- oder Königinnen-Charakterkarte von deiner Hand auswählen und abwerfen, um eine Charakterkarte aus deinem Ablagestapel zurück auf deine Hand zu nehmen.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Souveraine vaniteuse",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "CONVOCATION ROYALE",
        description:
          "Au début de votre tour, vous pouvez défausser une carte Personnage Princesse ou Reine pour renvoyer dans votre main une carte Personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "Monarca Presuntuosa",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "CONVOCAZIONE REALE",
        description:
          "All'inizio del tuo turno, puoi scegliere e scartare una carta personaggio Principessa o Regina per riprendere in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
