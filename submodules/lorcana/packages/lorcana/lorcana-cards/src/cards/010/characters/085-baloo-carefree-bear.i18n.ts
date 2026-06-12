import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const balooCarefreeBearI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baloo",
    version: "Carefree Bear",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title:
          "ROLL WITH IT When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Balu",
    version: "Sorgenfreier Bär",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "EINFACH MITSPIELEN",
        description:
          "Wenn du diesen Charakter ausspielst, wähle eine Möglichkeit aus: • Alle Mitspielenden (auch du) ziehen je 1 Karte. • Alle Mitspielenden (auch du) wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Baloo",
    version: "Ours insouciant",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "FAIRE AVEC",
        description:
          "Lorsque vous jouez ce personnage, choisissez entre: • Chaque joueur pioche une carte. • Chaque joueur défausse une carte.",
      },
    ],
  },
  it: {
    name: "Baloo",
    version: "Orso Spensierato",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "ADATTARSI",
        description:
          "Quando giochi questo personaggio, scegli uno: • Ogni giocatore pesca una carta. • Ogni giocatore sceglie e scarta una carta.",
      },
    ],
  },
};
