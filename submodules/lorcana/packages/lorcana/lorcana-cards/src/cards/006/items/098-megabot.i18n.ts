import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const megabotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "MegaBot",
    text: [
      {
        title: "HAPPY FACE",
        description: "This item enters play exerted.",
      },
      {
        title: "DESTROY!",
        description: "{E}, Banish this item — Choose one:",
      },
      {
        title: "* Banish chosen item.",
      },
      {
        title: "* Banish chosen damaged character.",
      },
    ],
  },
  de: {
    name: "MegaBot",
    text: [
      {
        title: "Freundliches Gesicht",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Zerstöre!",
        description: "{E}, Verbanne diesen Gegenstand — Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Verbanne einen Gegenstand deiner Wahl.",
      },
      {
        title: "• Verbanne einen beschädigten Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Méga-Robot",
    text: [
      {
        title: "Visage souriant",
        description: "Cet objet arrive en jeu épuisé.",
      },
      {
        title: "Détruis-le!",
        description: "{E}, bannissez cet objet — choisissez entre:",
      },
      {
        title: "• Choisissez un objet et bannissez-le.",
      },
      {
        title: "• Choisissez un personnage avec au moins 1 dommage sur lui et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Megabot",
    text: [
      {
        title: "Faccina Felice",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "Distruggi!",
        description: "{E}, esilia questo oggetto — Scegli uno:",
      },
      {
        title: "• Esilia un oggetto a tua scelta.",
      },
      {
        title: "• Esilia un personaggio danneggiato a tua scelta.",
      },
    ],
  },
  es: {
    name: "Megabot",
    text: [
      {
        title: "CARA FELIZ",
        description: "Este objeto entra en juego ejercido.",
      },
      {
        title: "¡DESTRUIR!",
        description: "{E}, desterrar este objeto — Elige uno:",
      },
      {
        title: "* Desterrar el elemento elegido.",
      },
      {
        title: "* Desterrar personaje dañado elegido.",
      },
    ],
  },
};
