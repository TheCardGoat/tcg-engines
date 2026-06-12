import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinkerBellMostHelpfulI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tinker Bell",
    version: "Most Helpful",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PIXIE DUST",
        description: "When you play this character, chosen character gains Evasive this turn.",
      },
    ],
  },
  de: {
    name: "Naseweis",
    version: "Stets hilfsbereit",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "FEENGLANZ",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Wendig.",
      },
    ],
  },
  fr: {
    name: "LA FÉE CLOCHETTE",
    version: "La plus serviable",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "POUSSIÈRE DE FÉE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Insaisissable pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tinker Bell",
    version: "Most Helpful",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PIXIE DUST",
        description: "When you play this character, chosen character gains Evasive this turn.",
      },
    ],
  },
};
