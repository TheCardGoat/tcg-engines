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
        title: "Insider-Job",
        description:
          "Wenn du einen Donald-Duck-Charakter im Spiel hast, zahlst du 1 {I} weniger, um diesen Gegenstand auszuspielen.",
      },
      {
        title: "Rückzahlung",
        description:
          "{E} — Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "La tirelire des neveux",
    text: [
      {
        title: "Combine",
        description:
          "Jouer cet objet vous coûte 1 {I} de moins si vous avez un personnage Donald en jeu.",
      },
      {
        title: "Récompense",
        description:
          "{E} — Choisissez un personnage qui subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Salvadanaio dei Nipoti",
    text: [
      {
        title: "Infiltrato",
        description:
          "Se hai in gioco un personaggio chiamato Paperino, paga 1 {I} in meno per giocare questo oggetto.",
      },
      {
        title: "Ricompensa",
        description:
          "{E} — Un personaggio a tua scelta riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
