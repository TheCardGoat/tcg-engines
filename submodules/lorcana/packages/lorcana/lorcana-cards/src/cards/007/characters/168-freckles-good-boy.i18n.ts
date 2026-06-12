import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const frecklesGoodBoyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Freckles",
    version: "Good Boy",
    text: [
      {
        title: "JUST SO CUTE!",
        description:
          "When you play this character, chosen opposing character gets -1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Pünktchen",
    version: "Guter Junge",
    text: [
      {
        title: "EINFACH NIEDLICH!",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -1.",
      },
    ],
  },
  fr: {
    name: "Biscotte",
    version: "Bon chien",
    text: [
      {
        title: "TELLEMENT MIGNON!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lentiggini",
    version: "Bravo Ragazzo",
    text: [
      {
        title: "COSÌ CARINO!",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -1 per questo turno.",
      },
    ],
  },
};
