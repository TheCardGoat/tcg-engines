import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lumiereNimbleCandelabraI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lumiere",
    version: "Nimble Candelabra",
    text: [
      {
        title: "QUICK-STEP",
        description: "While you have an item card in your discard, this character gains Evasive.",
      },
    ],
  },
  de: {
    name: "Lumière",
    version: "Flinker Kerzenleuchter",
    text: [
      {
        title: "MIT SCHNELLEN SCHRITTEN",
        description:
          "Solange du mindestens eine Gegenstandskarte in deinem Ablagestapel hast, erhält dieser Charakter Wendig.",
      },
    ],
  },
  fr: {
    name: "Lumière",
    version: "Candelabre agile",
    text: [
      {
        title: "DÉMARCHE RAPIDE",
        description:
          "Tant que vous avez une carte Objet dans votre défausse, ce personnage gagne Insaisissable.",
      },
    ],
  },
  it: {
    name: "Lumiere",
    version: "Agile Candelabro",
    text: [
      {
        title: "PASSO RAPIDO",
        description:
          "Mentre hai una carta oggetto nei tuoi scarti, questo personaggio ottiene Sfuggente. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
