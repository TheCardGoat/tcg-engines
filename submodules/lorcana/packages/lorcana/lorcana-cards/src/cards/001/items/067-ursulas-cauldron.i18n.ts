import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulasCauldronI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula’s Cauldron",
    text: [
      {
        title: "Peer Into the Depths",
        description:
          "{E} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      },
    ],
  },
  de: {
    name: "Ursulas Kessel",
    text: [
      {
        title: "Blicke in die Tiefe",
        description:
          "{E} — Schaue dir die obersten 2 Karten deines Decks an. Lege 1 davon auf dein Deck und die andere unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "CHAUDRON D'URSULA",
    text: [
      {
        title: "SURVEILLANCE DES PROFONDEURS",
        description:
          "{E} — Regardez les 2 premières cartes de votre pioche. Remettez-en une sur le dessus de votre pioche et l'autre en dessous.",
      },
    ],
  },
  it: {
    name: "Il Calderone di Ursula",
    text: [
      {
        title: "Scrutare negli Abissi",
        description:
          "{E} — Guarda le prime 2 carte del tuo mazzo. Mettine una in cima al tuo mazzo e l'altra in fondo.",
      },
    ],
  },
};
