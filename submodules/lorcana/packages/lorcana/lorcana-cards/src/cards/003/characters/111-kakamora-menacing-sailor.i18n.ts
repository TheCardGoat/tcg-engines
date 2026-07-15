import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kakamoraMenacingSailorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kakamora",
    version: "Menacing Sailor",
    text: [
      {
        title: "PLUNDER",
        description: "When you play this character, each opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "Kokomora",
    version: "Bedrohlicher Seefahrer",
    text: [
      {
        title: "Plündern",
        description:
          "Wenn du diesen Charakter ausspielst, verlieren alle gegnerischen Mitspielenden je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Kakamora",
    version: "Marin menaçant",
    text: [
      {
        title: "Pillage",
        description: "Lorsque vous jouez ce personnage, chaque adversaire perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Kakamora",
    version: "Marinaio Minaccioso",
    text: [
      {
        title: "Razzia",
        description: "Quando giochi questo personaggio, ogni avversario perde 1 leggenda.",
      },
    ],
  },
};
