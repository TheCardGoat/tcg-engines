import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyGhostOfJacobMarleyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Ghost of Jacob Marley",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "GRAVE OUTCOME",
        description:
          "When this character is banished, each opponent chooses and discards a card for each card that was under him.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Geist von Jacob Marley",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "GRAVIERENDES ENDE",
        description:
          "Wenn dieser Charakter verbannt wird, wählen alle gegnerischen Mitspielenden für jede Karte, die unter diesem Charakter lag, je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Fantôme de Jacob Marley",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "CONSÉQUENCE SÉPULCRALE",
        description:
          "Lorsque ce personnage est banni, chaque adversaire défausse une carte pour chaque carte sous ce personnage.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Fantasma di Jacob Marley",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "CONSEGUENZA FUNEREA",
        description:
          "Quando questo personaggio viene esiliato, ogni avversario sceglie e scarta una carta per ogni carta che era sotto di esso.",
      },
    ],
  },
};
