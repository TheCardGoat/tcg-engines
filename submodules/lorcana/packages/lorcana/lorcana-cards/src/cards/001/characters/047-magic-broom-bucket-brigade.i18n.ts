import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomBucketBrigadeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Bucket Brigade",
    text: [
      {
        title: "SWEEP",
        description:
          "When you play this character, you may shuffle a card from any discard into its player's deck.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Wasser marsch!",
    text: [
      {
        title: "FEGEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Karte deiner Wahl aus einem Ablagestapel zurück in das zugehörige Deck mischen.",
      },
    ],
  },
  fr: {
    name: "BALAIS MAGIQUES",
    version: "Armés de seaux",
    text: [
      {
        title: "BALAYER",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez remélanger une carte de la défausse de n'importe quel joueur dans sa pioche.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Brigata del Secchio",
    text: [
      {
        title: "SPAZZARE",
        description:
          "Quando giochi questo personaggio, puoi rimescolare una carta dagli scarti di un qualsiasi giocatore nel suo mazzo.",
      },
    ],
  },
};
