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
        title: "Diese Mission ist verflucht",
        description: "Dieser Charakter wird zu Beginn deines Zuges nicht bereit gemacht.",
      },
      {
        title: "Ich geb dir Deckung",
        description:
          "2 {I} — Mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Maui",
    version: "Baleine",
    text: [
      {
        title: "Cette mission est fichue",
        description: "Ce personnage ne se redresse pas au début de votre tour.",
      },
      {
        title: "Ne t'inquiète pas, je suis là",
        description:
          "2 {I} — Redressez ce personnage, il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Maui",
    version: "Balena",
    text: [
      {
        title: "La Missione è Maledetta",
        description: "Questo personaggio non si può preparare all'inizio del tuo turno.",
      },
      {
        title: "Ti Guardo le Spalle",
        description:
          "2 {I} — Prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Maui",
    version: "Ballena",
    text: [
      {
        title: "ESTA MISIÓN ESTÁ MALDIDA",
        description: "Este personaje no puede prepararse al comienzo de tu turno.",
      },
      {
        title: "Te cubro la espalda 2",
        description:
          "{I} — Listo este personaje. No puede realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
