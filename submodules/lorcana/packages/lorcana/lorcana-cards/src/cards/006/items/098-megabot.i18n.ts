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
      },
      {
        title: "{E},",
        description: "Banish this item — Choose one:",
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
        title: "FREUNDLICHES GESICHT",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "ZERSTÖRE!,",
        description:
          "Verbanne diesen Gegenstand — Wähle eine Möglichkeit aus: • Verbanne einen Gegenstand deiner Wahl. • Verbanne einen beschädigten Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Méga-Robot",
    text: [
      {
        title: "VISAGE SOURIANT",
        description: "Cet objet arrive en jeu épuisé.",
      },
      {
        title: "DÉTRUIS-LE!,",
        description:
          "bannissez cet objet — choisissez entre: • Choisissez un objet et bannissez-le. • Choisissez un personnage avec au moins 1 dommage sur lui et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Megabot",
    text: [
      {
        title: "FACCINA FELICE",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "DISTRUGGI!,",
        description:
          "esilia questo oggetto — Scegli uno: • Esilia un oggetto a tua scelta. • Esilia un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
