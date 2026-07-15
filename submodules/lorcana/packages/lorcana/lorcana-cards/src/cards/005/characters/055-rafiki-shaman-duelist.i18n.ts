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
        title: "<Rasant>",
      },
      {
        title: "Überraschende Fähigkeiten",
        description:
          "Wenn du diesen Charakter ausspielst, erhält er in diesem Zug <Herausfordern> +4. (Während dieser Charakter herausfordert, erhält er +4 {S}).",
      },
    ],
  },
  fr: {
    name: "Rafiki",
    version: "Chamane duelliste",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Prendre par surprise",
        description:
          "Lorsque vous jouez ce personnage, il gagne <Offensif> +4 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Rafiki",
    version: "Sciamano Duellante",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Abilità Sorprendente",
        description:
          "Quando giochi questo personaggio, ottiene <Sfidante> +4 per questo turno. (Riceve +4 {S} mentre sta sfidando.)",
      },
    ],
  },
};
