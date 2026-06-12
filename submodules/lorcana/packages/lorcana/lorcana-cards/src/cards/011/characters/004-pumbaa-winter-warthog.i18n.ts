import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pumbaaWinterWarthogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pumbaa",
    version: "Winter Warthog",
    text: [
      {
        title: "SHAKE THINGS UP",
        description: "When you play this character, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Pumbaa",
    version: "Winter-Warzenschwein",
    text: [
      {
        title: "DIE DINGE AUFRÜTTELN",
        description:
          "Wenn du diesen Charakter ausspielst, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Pumbaa",
    version: "Phacochère hivernal",
    text: [
      {
        title: "SECOUEZ LES CHOSES",
        description: "Lorsque vous jouez ce personnage, chaque adversaire défausse une carte.",
      },
    ],
  },
  it: {
    name: "Pumbaa",
    version: "Facocero Invernale",
    text: [
      {
        title: "DARE UNA SCOSSA",
        description:
          "Quando giochi questo personaggio, ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
};
