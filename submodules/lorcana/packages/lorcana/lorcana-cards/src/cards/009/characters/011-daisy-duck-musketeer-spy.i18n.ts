import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckMusketeerSpyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Musketeer Spy",
    text: [
      {
        title: "INFILTRATION",
        description: "When you play this character, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Daisy Duck",
    version: "Musketier-Spionin",
    text: [
      {
        title: "INFILTRATION",
        description:
          "Wenn du diesen Charakter ausspielst, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Daisy",
    version: "Mousquetaire espionne",
    text: [
      {
        title: "INFILTRATION",
        description:
          "Lorsque vous jouez ce personnage, chaque adversaire choisit une carte de sa main et la défausse.",
      },
    ],
  },
  it: {
    name: "Paperina",
    version: "Spia dei Moschettieri",
    text: [
      {
        title: "INFILTRARSI",
        description:
          "Quando giochi questo personaggio, ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
};
