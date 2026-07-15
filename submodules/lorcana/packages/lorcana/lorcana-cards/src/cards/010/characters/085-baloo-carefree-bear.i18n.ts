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
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Balu-Charaktere auszuspielen.)",
      },
      {
        title: "Einfach mitspielen",
        description: "Wenn du diesen Charakter ausspielst, wähle eine Möglichkeit aus:",
      },
      {
        title: "• Alle Mitspielenden (auch du) ziehen je 1 Karte.",
      },
      {
        title: "• Alle Mitspielenden (auch du) wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Baloo",
    version: "Ours insouciant",
    text: [
      {
        title: "<Alter> 3 {I}",
      },
      {
        title: "Faire avec",
        description: "Lorsque vous jouez ce personnage, choisissez entre:",
      },
      {
        title: "• Chaque joueur pioche une carte.",
      },
      {
        title: "• Chaque joueur défausse une carte.",
      },
    ],
  },
  it: {
    name: "Baloo",
    version: "Orso Spensierato",
    text: [
      {
        title: "<Trasformazione> 3 {I}",
      },
      {
        title: "Adattarsi",
        description: "Quando giochi questo personaggio, scegli uno:",
      },
      {
        title: "• Ogni giocatore pesca una carta.",
      },
      {
        title: "• Ogni giocatore sceglie e scarta una carta.",
      },
    ],
  },
};
