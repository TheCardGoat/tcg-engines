import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenConceitedRulerP3ChallengeI18n: Record<Languages, I18nProperties> = {
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
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Königliche Vorladung",
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
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Convocation royale",
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
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Convocazione Reale",
        description:
          "All'inizio del tuo turno, puoi scegliere e scartare una carta personaggio Principessa o Regina per riprendere in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
