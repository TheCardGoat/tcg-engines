import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wreckitRalphBackSeatDriverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wreck-It Ralph",
    version: "Back Seat Driver",
    text: [
      {
        title: "CHARGED UP",
        description: "When you play this character, chosen Racer character gets +4 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Randale Ralph",
    version: "Rücksitzfahrer",
    text: [
      {
        title: "AUFGELADEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Rennfahrer deiner Wahl in diesem Zug +4.",
      },
    ],
  },
  fr: {
    name: "Ralph la Casse",
    version: "Copilote envahissant",
    text: [
      {
        title: "CHARGÉ À BLOC",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage Pilote qui gagne +4 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ralph Spaccatutto",
    version: "Passeggero Invadente",
    text: [
      {
        title: "CARICO",
        description:
          "Quando giochi questo personaggio, un personaggio Pilota a tua scelta riceve +4 per questo turno.",
      },
    ],
  },
};
