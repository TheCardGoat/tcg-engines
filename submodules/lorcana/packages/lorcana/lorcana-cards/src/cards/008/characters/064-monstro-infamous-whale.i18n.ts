import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const monstroInfamousWhaleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Monstro",
    version: "Infamous Whale",
    text: [
      {
        title: "Rush",
      },
      {
        title: "FULL BREACH",
        description:
          "Choose and discard a card — Ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Monstro",
    version: "Berüchtigter Wal",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "VOLLER DURCHBRUCH",
        description:
          "Wähle eine Karte aus deiner Hand und wirf sie ab — Mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Monstro",
    version: "Baleine tristement célèbre",
    text: [
      {
        title: "Charge",
      },
      {
        title: "PERCÉE COMPLÈTE",
        description:
          "Défaussez une carte — Redressez ce personnage. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Balena",
    version: "Famigerato Cetaceo",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "INCURSIONE",
        description:
          "Scegli e scarta una carta — Prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
