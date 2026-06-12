import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theReturnOfHerculesEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Return of Hercules",
    text: "Each player may reveal a character card from their hand and play it for free.",
  },
  de: {
    name: "Die Rückkehr von Hercules",
    text: [
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) dürfen je 1 Charakterkarte aus ihrer Hand vorzeigen und kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Le retour d’Hercule",
    text: "Chaque joueur peut révéler une carte Personnage de sa main et la jouer gratuitement.",
  },
  it: {
    name: "Il Ritorno di Ercole",
    text: "Ogni giocatore può rivelare una carta personaggio dalla sua mano e giocarla gratis.",
  },
};
