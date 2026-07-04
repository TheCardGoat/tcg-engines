import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const angusMightyHorseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Angus",
    version: "Mighty Horse",
    text: [
      {
        title: "DAUNTLESS",
        description:
          "When you play this character, chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Angus",
    version: "Mächtiges Pferd",
    text: [
      {
        title: "Furchtlos",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug <Alarmiert>. (Der Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Angus",
    version: "Puissant cheval",
    text: [
      {
        title: "Fonceur",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne <Agilité> pour le reste de ce tour. (Ce personnage-là peut défier comme s'il avait Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Angus",
    version: "Cavallo Possente",
    text: [
      {
        title: "Temerario",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Vigile> per questo turno. (Può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
