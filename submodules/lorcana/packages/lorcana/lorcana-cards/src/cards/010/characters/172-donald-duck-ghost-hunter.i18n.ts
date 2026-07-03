import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckGhostHunterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Ghost Hunter",
    text: [
      {
        title: "RAISE",
        description:
          "A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Geisterjäger",
    text: [
      {
        title: "Einen Aufstand anzetteln",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Detektiv deiner Wahl in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Chasseur de fantômes",
    text: [
      {
        title: "Faire du grabuge",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage Détective qui gagne <Offensif> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Cacciatore di Fantasmi",
    text: [
      {
        title: "Alzare un Polverone",
        description:
          "Quando giochi questo personaggio, un personaggio Detective a tua scelta ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
};
