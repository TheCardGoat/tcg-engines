import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rafikiShamanDuelistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rafiki",
    version: "Shaman Duelist",
    text: [
      {
        title: "Rush",
      },
      {
        title: "SURPRISING SKILL",
        description:
          "When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Rafiki",
    version: "Schamanischer Duellant",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "ÜBERRASCHENDE FÄHIGKEITEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält er in diesem Zug Herausfordern +4. (Während dieser Charakter herausfordert, erhält er +4).",
      },
    ],
  },
  fr: {
    name: "Rafiki",
    version: "Chamane duelliste",
    text: [
      {
        title: "Charge",
      },
      {
        title: "PRENDRE PAR SURPRISE",
        description:
          "Lorsque vous jouez ce personnage, il gagne Offensif +4 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Rafiki",
    version: "Sciamano Duellante",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "ABILITÀ SORPRENDENTE",
        description: "Quando giochi questo personaggio, ottiene Sfidante +4 per questo turno.",
      },
    ],
  },
};
