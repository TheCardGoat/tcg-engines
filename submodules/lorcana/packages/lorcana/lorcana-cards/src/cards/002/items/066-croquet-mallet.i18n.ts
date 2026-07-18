import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const croquetMalletI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Croquet Mallet",
    text: [
      {
        title: "HURTLING HEDGEHOG",
        description:
          "Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Krocketschläger",
    text: [
      {
        title: "Rasender Igel",
        description:
          "Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug <Rasant>. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Maillet de croquet",
    text: [
      {
        title: "Hérisson véloce",
        description:
          "Bannissez cet objet — Choisissez un personnage, il gagne <Charge> pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Croquet Mallet",
    text: [
      {
        title: "Hurtling Hedgehog",
        description:
          "Banish this item — Chosen character gains <Rush> this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  es: {
    name: "Mazo de croquet",
    text: [
      {
        title: "ERIZO RÁPIDO",
        description:
          "Desterrar este objeto: el personaje elegido gana Rush este turno. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
