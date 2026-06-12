import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeEricExpertHelmsmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Eric",
    version: "Expert Helmsman",
    text: [
      {
        title: "SURPRISE MANEUVER",
        description: "When this character is banished, you may banish chosen character.",
      },
    ],
  },
  de: {
    name: "Prinz Eric",
    version: "Erfahrener Steuermann",
    text: [
      {
        title: "ÜBERRASCHUNGSMANÖVER",
        description:
          "Wenn dieser Charakter verbannt wird, darfst du einen Charakter deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Prince Eric",
    version: "Maître timonier",
    text: [
      {
        title: "MANŒUVRE SURPRISE",
        description: "Lorsque ce personnage est banni, choisissez un personnage et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Principe Eric",
    version: "Timoniere Esperto",
    text: [
      {
        title: "MANOVRA A SORPRESA",
        description:
          "Quando questo personaggio viene esiliato, puoi esiliare un personaggio a tua scelta.",
      },
    ],
  },
};
