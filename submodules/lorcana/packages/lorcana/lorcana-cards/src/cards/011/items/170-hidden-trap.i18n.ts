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
        description: "{E}, Banish this item — Choose one:",
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
        title: "Fast fertig",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "SCHNAPP!",
        description: "{E}, Verbanne diesen Gegenstand — Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Verbanne einen Gegenstand deiner Wahl.",
      },
      {
        title: "• Ein gegnerischer Charakter deiner Wahl erhält in diesem Zug -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Piège caché",
    text: [
      {
        title: "Presque prêt",
        description: "Cet objet entre en jeu épuisé.",
      },
      {
        title: "TCHAC!",
        description: "{E}, Bannissez cet objet — Choisissez entre:",
      },
      {
        title: "• Choisissez un objet et bannissez-le.",
      },
      {
        title: "• Choisissez un personnage adverse qui subit -2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Trappola Nascosta",
    text: [
      {
        title: "Quasi Pronta",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "SNAP!",
        description: "{E}, esilia questo oggetto — Scegli uno:",
      },
      {
        title: "• Esilia un oggetto a tua scelta.",
      },
      {
        title: "• Un personaggio avversario a tua scelta riceve -2 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Trampa oculta",
    text: [
      {
        title: "CASI LISTO",
        description: "Este objeto entra en juego ejercido.",
      },
      {
        title: "¡QUEBRAR!",
        description: "{E}, desterrar este objeto — Elige uno:",
      },
      {
        title: "* Desterrar el elemento elegido.",
      },
      {
        title: "* El personaje contrario elegido obtiene -2 {S} este turno.",
      },
    ],
  },
};
