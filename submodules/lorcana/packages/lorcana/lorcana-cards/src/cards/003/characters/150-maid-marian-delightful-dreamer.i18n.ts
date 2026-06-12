import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maidMarianDelightfulDreamerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maid Marian",
    version: "Delightful Dreamer",
    text: [
      {
        title: "HIGHBORN LADY",
        description: "When you play this character, chosen character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Maid Marian",
    version: "Entzückende Träumerin",
    text: [
      {
        title: "VORNEHME UND ADLIGE DAME",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug -2.",
      },
    ],
  },
  fr: {
    name: "Belle Marianne",
    version: "Charmante rêveuse",
    text: [
      {
        title: "DEMOISELLE DE HAUTE LIGNÉE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lady Marian",
    version: "Incantevole Sognatrice",
    text: [
      {
        title: "NOBILE DAMA",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve -2 per questo turno.",
      },
    ],
  },
};
