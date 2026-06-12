import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elsaConcernedSisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elsa",
    version: "Concerned Sister",
    text: [
      {
        title: "CLEAR THE WAY",
        description:
          "When you play this character, you pay 2 {I} less for the next location you play this turn.",
      },
    ],
  },
  de: {
    name: "Elsa",
    version: "Besorgte Schwester",
    text: [
      {
        title: "MACHT DEN WEG FREI",
        description:
          "Wenn du diesen Charakter ausspielst, zahlst du 2 weniger für den nächsten Ort, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Sœur soucieuse",
    text: [
      {
        title: "OUVRIR LA VOIE",
        description:
          "Lorsque vous jouez ce personnage, le prochain lieu que vous jouez ce tour-ci vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Sorella Preoccupata",
    text: [
      {
        title: "APRIRE LA STRADA",
        description:
          "Quando giochi questo personaggio, paga 2 in meno per giocare il tuo prossimo luogo per questo turno.",
      },
    ],
  },
};
