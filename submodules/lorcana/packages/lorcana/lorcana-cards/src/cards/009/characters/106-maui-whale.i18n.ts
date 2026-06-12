import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauiWhaleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maui",
    version: "Whale",
    text: [
      {
        title: "THIS MISSION IS CURSED",
        description: "This character can't ready at the start of your turn.",
      },
      {
        title: "I GOT YOUR BACK 2",
        description: "{I} — Ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Maui",
    version: "Wal",
    text: [
      {
        title: "DIESE MISSION IST VERFLUCHT",
        description: "Dieser Charakter wird zu Beginn deines Zuges nicht bereit gemacht.",
      },
      {
        title: "ICH GEB DIR DECKUNG 2",
        description: "— Mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Maui",
    version: "Baleine",
    text: [
      {
        title: "CETTE MISSION EST FICHUE",
        description: "Ce personnage ne se redresse pas au début de votre tour.",
      },
      {
        title: "NE",
        description:
          "T'INQUIÈTE PAS, JE SUIS LÀ 2 — Redressez ce personnage, il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Maui",
    version: "Balena",
    text: [
      {
        title: "LA MISSIONE",
        description:
          "È MALEDETTA Questo personaggio non si può preparare all'inizio del tuo turno.",
      },
      {
        title: "TI GUARDO LE SPALLE 2",
        description:
          "— Prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
