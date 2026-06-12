import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hiddenTrapI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hidden Trap",
    text: [
      {
        title: "ALMOST READY",
        description: "This item enters play exerted.",
      },
      {
        title: "SNAP!",
      },
      {
        title: "{E},",
        description: "Banish this item — Choose one:",
      },
      {
        title: "* Banish chosen item.",
      },
      {
        title: "* Chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Versteckte Falle",
    text: [
      {
        title: "FAST FERTIG",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "SCHNAPP!,",
        description:
          "Verbanne diesen Gegenstand — Wähle eine Möglichkeit aus: • Verbanne einen Gegenstand deiner Wahl. • Ein gegnerischer Charakter deiner Wahl erhält in diesem Zug -2.",
      },
    ],
  },
  fr: {
    name: "Piège caché",
    text: [
      {
        title: "PRESQUE PRÊT",
        description: "Cet objet entre en jeu épuisé.",
      },
      {
        title: "TCHAC!,",
        description:
          "Bannissez cet objet — Choisissez entre: • Choisissez un objet et bannissez-le. • Choisissez un personnage adverse qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Trappola Nascosta",
    text: [
      {
        title: "QUASI PRONTA",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "SNAP!,",
        description:
          "esilia questo oggetto — Scegli uno: • Esilia un oggetto a tua scelta. • Un personaggio avversario a tua scelta riceve -2 per questo turno.",
      },
    ],
  },
};
