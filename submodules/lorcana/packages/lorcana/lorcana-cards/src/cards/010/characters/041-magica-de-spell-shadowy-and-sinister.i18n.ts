import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellShadowyAndSinisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "Shadowy and Sinister",
    text: [
      {
        title: "DARK INCANTATION",
        description:
          "When you play this character, you may shuffle a card from chosen player's discard into their deck.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Schattenhaft und unheimlich",
    text: [
      {
        title: "DUNKLE BESCHWÖRUNG",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Karte deiner Wahl aus einem Ablagestapel zurück in das zugehörige Deck mischen.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Ombre sinistre",
    text: [
      {
        title: "INCANTATION TÉNÉBREUSE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un joueur et mélanger une carte de sa défausse dans sa pioche.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "Tenebrosa e Sinistra",
    text: [
      {
        title: "INCANTO OSCURO",
        description:
          "Quando giochi questo personaggio, puoi mescolare una carta dagli scarti di un giocatore a tua scelta nel suo mazzo.",
      },
    ],
  },
};
