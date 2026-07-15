import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const letsGetDangerousI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Let's Get Dangerous",
    text: "Each player shuffles their deck and then reveals the top card. Each player who reveals a character card may play that character for free. Otherwise, put the revealed cards on the bottom of their player's deck.",
  },
  de: {
    name: "Zwo, Eins, Risiko",
    text: [
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) mischen ihr Deck und decken dann die oberste Karte auf. Wer auf diese Weise eine Charakterkarte aufdeckt, darf diese kostenlos ausspielen. Wer sie nicht spielt, legt die Karte unter das eigene Deck.",
      },
    ],
  },
  fr: {
    name: "Cette chanson craint un mask",
    text: "Chaque joueur mélange sa pioche, puis révèle la carte du dessus de sa pioche. Chaque joueur qui révèle une carte Personnage peut jouer ce personnage gratuitement. Sinon, placez les cartes révélées sous la pioche de leur propriétaire.",
  },
  it: {
    name: "Dagli Addosso, Duck",
    text: "Ogni giocatore mescola il suo mazzo e poi rivela la prima carta. Ogni giocatore che ha rivelato una carta personaggio può giocare quel personaggio gratis. Altrimenti, metti le carte rivelate in fondo al mazzo dei loro giocatori.",
  },
};
