import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const whiteRabbitsPocketWatchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "White Rabbit’s Pocket Watch",
    text: [
      {
        title: "I'm Late!",
        description:
          "{E}, 1 {I} — Chosen character gains <Rush> this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Taschenuhr des weißen Kaninchens",
    text: [
      {
        title: "Zu spät!",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "MONTRE À GOUSSET",
    text: [
      {
        title: "EN RETARD!",
        description:
          "{E}, 1 {I} — Choisissez un personnage, il gagne Charge pour le reste de ce tour. (Il peut défier le tour où il est joué.)",
      },
    ],
  },
  it: {
    name: "White Rabbit’s Pocket Watch",
    text: [
      {
        title: "I'm Late!",
        description:
          "{E}, 1 {I} — Chosen character gains <Rush> this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
};
