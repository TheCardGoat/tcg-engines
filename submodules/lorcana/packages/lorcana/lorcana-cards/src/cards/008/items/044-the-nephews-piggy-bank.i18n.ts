import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theNephewsPiggyBankI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Nephews' Piggy Bank",
    text: [
      {
        title: "INSIDE JOB",
        description:
          "If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
      },
      {
        title: "PAYOFF",
        description: "{E} — Chosen character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Das Sparschwein der Neffen",
    text: [
      {
        title: "INSIDER-JOB",
        description:
          "Wenn du einen Donald-Duck-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Gegenstand auszuspielen.",
      },
      {
        title: "RÜCKZAHLUNG",
        description: "— Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1.",
      },
    ],
  },
  fr: {
    name: "La tirelire des neveux",
    text: [
      {
        title: "COMBINE",
        description:
          "Jouer cet objet vous coûte 1 de moins si vous avez un personnage Donald en jeu.",
      },
      {
        title: "RÉCOMPENSE",
        description:
          "— Choisissez un personnage qui subit -1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Salvadanaio dei Nipoti",
    text: [
      {
        title: "INFILTRATO",
        description:
          "Se hai in gioco un personaggio chiamato Paperino, paga 1 in meno per giocare questo oggetto.",
      },
      {
        title: "RICOMPENSA",
        description:
          "— Un personaggio a tua scelta riceve -1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
