import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastAggressiveLordI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Aggressive Lord",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "THAT'S MINE",
        description:
          "Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Wütender Gebieter",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "DAS IST MEINS",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, falls dieser Charakter mindestens eine Karte unter sich hat, verlieren alle gegnerischen Mitspielenden je 1 Legende und du sammelst 1 Legende.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Noble agressif",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "C'EST",
        description:
          "À MOI! Chaque fois qu'il défie un autre personnage, s'il y a une carte sous ce personnage-ci, chaque adversaire perd 1 éclat de Lore et vous gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "La Bestia",
    version: "Signore Aggressivo",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title:
          "È MIA Ogni volta che sfida un altro personaggio, se c'è una carta sotto a questo personaggio, ogni avversario perde 1 leggenda e tu ottieni 1 leggenda.",
      },
    ],
  },
};
