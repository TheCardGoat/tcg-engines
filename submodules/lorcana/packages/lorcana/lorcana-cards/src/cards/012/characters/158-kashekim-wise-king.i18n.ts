import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kashekimWiseKingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kashekim",
    version: "Wise King",
    text: [
      {
        title: "STRENGTH IN MEMORY",
        description:
          "At the end of your turn, if 2 or more cards were put into your discard this turn, you may put the top card of your deck into your inkwell facedown.",
      },
    ],
  },
  de: {
    name: "Kashekim",
    version: "Weiser König",
    text: [
      {
        title: "Stärke der Erinnerung",
        description:
          "Am Ende deines Zuges, falls in diesem Zug mindestens 2 Karten auf deinen Ablagestapel gelegt wurden, darfst du die oberste Karte deines Decks verdeckt in deinen Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Kashekim",
    version: "Roi sage",
    text: [
      {
        title: "La force de la mémoire",
        description:
          "À la fin de votre tour, si 2 cartes ou plus ont été placées dans votre défausse ce tour-ci, vous pouvez placer la carte du dessus de votre pioche dans votre réserve d'encre, face cachée.",
      },
    ],
  },
  it: {
    name: "Kashekim",
    version: "Saggio Re",
    text: [
      {
        title: "La Forza dei Ricordi",
        description:
          "Alla fine del tuo turno, se 2 o più carte sono state messe nei tuoi scarti in questo turno, puoi aggiungere la prima carta del tuo mazzo al tuo calamaio, a faccia in giù.",
      },
    ],
  },
};
