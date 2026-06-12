import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ratiganGreedyGeniusI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ratigan",
    version: "Greedy Genius",
    text: [
      {
        title: "Ward",
      },
      {
        title: "TIME RUNS OUT",
        description:
          "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
      },
    ],
  },
  de: {
    name: "Rattenzahn",
    version: "Gieriges Genie",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "DIE ZEIT LÄUFT AB",
        description:
          "Am Ende deines Zuges, falls du in diesem Zug keine Karte in deinen Tintenvorrat gelegt hast, verbanne diesen Charakter.",
      },
    ],
  },
  fr: {
    name: "Ratigan",
    version: "Génie cupide",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "LE TEMPS PRESSE",
        description:
          "À la fin de votre tour, si vous n'avez placé aucune carte dans votre réserve d'encre ce tour-ci, bannissez ce personnage.",
      },
    ],
  },
  it: {
    name: "Rattigan",
    version: "Avido Genio",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "TEMPO SCADUTO",
        description:
          "Alla fine del tuo turno, se non hai aggiunto nessuna carta al tuo calamaio in questo turno, esilia questo personaggio.",
      },
    ],
  },
};
