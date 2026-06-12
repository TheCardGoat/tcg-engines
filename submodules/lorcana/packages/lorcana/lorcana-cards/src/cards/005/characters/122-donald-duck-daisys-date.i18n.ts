import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckDaisysDateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Daisy's Date",
    text: [
      {
        title: "PLUCKY PLAY",
        description:
          "Whenever this character challenges another character, each opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Daisys Verabredung",
    text: [
      {
        title: "ENT-SCHEIDENDES SPIEL",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, verlieren alle gegnerischen Mitspielenden je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Rendez-vous de Daisy",
    text: [
      {
        title: "ON LES PLUMERA!",
        description:
          "Chaque fois que ce personnage en défie un autre, chaque adversaire perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Ragazzo di Paperina",
    text: [
      {
        title: "MOSSA SPENNACOLARE",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, ogni avversario perde 1 leggenda.",
      },
    ],
  },
};
