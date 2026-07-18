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
        title: "<Rasant>",
      },
      {
        title: "Voller Durchbruch",
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
        title: "<Charge>",
      },
      {
        title: "Percée complète",
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
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Incursione",
        description:
          "Scegli e scarta una carta — Prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Monstruo",
    version: "Ballena infame",
    text: [
      {
        title: "Correr",
      },
      {
        title: "INCUMPLIMIENTO TOTAL",
        description:
          "Elige y descarta una carta: prepara este personaje. No puede realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
