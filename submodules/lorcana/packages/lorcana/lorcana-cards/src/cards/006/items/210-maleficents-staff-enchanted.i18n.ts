import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maleficentsStaffEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maleficent's Staff",
    text: [
      {
        title: "BACK, FOOLS!",
        description:
          "Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Malefiz’ Stab",
    text: [
      {
        title: "ZURÜCK, IHR NARREN!",
        description:
          "Jedes Mal, wenn ein gegnerischer Charakter, Gegenstand oder Ort zurück auf die zugehörige Hand geschickt wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Sceptre de Maléfique",
    text: [
      {
        title: "REVENEZ, IMBÉCILES!",
        description:
          "Chaque fois qu'un personnage, un objet ou un lieu d'un adversaire est renvoyé dans sa main depuis le jeu, vous gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Bastone di Malefica",
    text: [
      {
        title: "INDIETRO, PAZZI!",
        description:
          "Ogni volta che uno dei personaggi, degli oggetti o dei luoghi dei tuoi avversari viene ripreso in mano dal gioco, ottieni 1 leggenda.",
      },
    ],
  },
};
