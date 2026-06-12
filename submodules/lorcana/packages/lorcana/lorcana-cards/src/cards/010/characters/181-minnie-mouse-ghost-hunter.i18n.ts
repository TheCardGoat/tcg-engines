import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseGhostHunterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Ghost Hunter",
    text: [
      {
        title: "SEARCH THE SHADOWS",
        description:
          "When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Geisterjägerin",
    text: [
      {
        title: "SUCHE IN DEN SCHATTEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Detektiv deiner Wahl in diesem Zug Alarmiert. (Der Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Chasseuse de fantômes",
    text: [
      {
        title: "INVESTIGUER LES OMBRES",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage Détective qui gagne Agilité pour le reste de ce tour. (Il peut défier comme s'il avait Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Cacciatrice di Fantasmi",
    text: [
      {
        title: "CERCARE TRA LE OMBRE",
        description:
          "Quando giochi questo personaggio, un personaggio Detective a tua scelta ottiene Vigile per questo turno. (Può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
