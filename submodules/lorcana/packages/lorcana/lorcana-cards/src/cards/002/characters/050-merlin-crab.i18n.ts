import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinCrabI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Crab",
    text: [
      {
        title: "READY OR NOT!",
        description:
          "When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Krabbe",
    text: [
      {
        title: "NEHMT EUCH IN ACHT!",
        description:
          "Wenn du diesen Charakter ausspielst und wenn er das Spiel verlässt, erhält ein Charakter deiner Wahl in diesem Zug Herausfordern +3 (Während der Charakter herausfordert, erhält er +3).",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "En crabe",
    text: [
      {
        title: "J'ESPÈRE QUE VOUS ÊTES PRÊTE!",
        description:
          "Lorsque vous jouez ce personnage et lorsqu'il quitte la zone de jeu, choisissez un personnage qui gagne Offensif +3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Merlin",
    version: "Crab",
    text: [
      {
        title: "READY OR NOT!",
        description:
          "When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 while challenging.)",
      },
    ],
  },
};
