import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeJohnPhonyKingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince John",
    version: "Phony King",
    text: [
      {
        title: "COLLECT TAXES",
        description:
          "Whenever this character quests, each opponent with more lore than you loses 2 lore.",
      },
    ],
  },
  de: {
    name: "Prinz John",
    version: "Königsclown",
    text: [
      {
        title: "STEUERN EINTREIBEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, verlieren alle gegnerischen Mitspielenden, die mehr Legenden als du haben, je 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Prince Jean",
    version: "Roi de mauvais aloi",
    text: [
      {
        title: "COLLECTE DE TAXES",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, chaque adversaire ayant plus d'éclats de Lore que vous en perd 2.",
      },
    ],
  },
  it: {
    name: "Principe Giovanni",
    version: "Re Fasullo",
    text: [
      {
        title: "RISCUOTERE LE TASSE",
        description:
          "Ogni volta che questo personaggio va all'avventura, ogni avversario con più leggenda di te perde 2 leggenda.",
      },
    ],
  },
};
