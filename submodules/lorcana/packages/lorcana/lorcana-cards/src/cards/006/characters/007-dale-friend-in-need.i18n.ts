import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daleFriendInNeedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dale",
    version: "Friend in Need",
    text: [
      {
        title: "CHIP'S PARTNER",
        description:
          "This character enters play exerted unless you have a character named Chip in play.",
      },
    ],
  },
  de: {
    name: "Chap",
    version: "Freund in der Not",
    text: [
      {
        title: "Chips Partner",
        description:
          "Dieser Charakter kommt erschöpft ins Spiel, außer du hast mindestens einen Chip-Charakter im Spiel.",
      },
    ],
  },
  fr: {
    name: "Tac",
    version: "Ami dans le besoin",
    text: [
      {
        title: "Partenaire de Tic",
        description:
          "Ce personnage entre en jeu épuisé à moins que vous n'ayez un personnage Tic en jeu.",
      },
    ],
  },
  it: {
    name: "Ciop",
    version: "Amico Bisognoso",
    text: [
      {
        title: "Partner di Cip",
        description:
          "Questo personaggio entra in gioco impegnato a meno che tu non abbia in gioco un personaggio chiamato Cip.",
      },
    ],
  },
  es: {
    name: "Valle",
    version: "Amigo necesitado",
    text: [
      {
        title: "SOCIO DE CHIP",
        description:
          "Este personaje entra en juego ejercido a menos que tengas un personaje llamado Chip en juego.",
      },
    ],
  },
};
