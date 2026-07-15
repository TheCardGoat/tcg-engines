import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ratigansMarvelousTrapI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ratigan's Marvelous Trap",
    text: [
      {
        title: "SNAP!",
      },
      {
        title: "BOOM!",
      },
      {
        title: "TWANG!",
        description: "Banish this item — Each opponent loses 2 lore.",
      },
    ],
  },
  de: {
    name: "Rattenzahns fabelhafte Falle",
    text: "Schnapp! Bums! Boing! Verbanne diesen Gegenstand — Alle gegnerischen Mitspielenden verlieren je 2 Legenden.",
  },
  fr: {
    name: "Piège génial de Ratigan",
    text: "Zap! Boum! Twing! Bannissez cet objet — Chaque adversaire perd 2 éclats de Lore.",
  },
  it: {
    name: "Ratigan's Marvelous Trap",
    text: "Snap! Boom! Twang! Banish this item — Each opponent loses 2 lore.",
  },
};
