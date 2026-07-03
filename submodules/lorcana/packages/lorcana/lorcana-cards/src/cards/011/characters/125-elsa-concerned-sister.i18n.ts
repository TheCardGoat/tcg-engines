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
        title: "Macht den Weg frei",
        description:
          "Wenn du diesen Charakter ausspielst, zahlst du 2 {I} weniger für den nächsten Ort, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Sœur soucieuse",
    text: [
      {
        title: "Ouvrir la voie",
        description:
          "Lorsque vous jouez ce personnage, le prochain lieu que vous jouez ce tour-ci vous coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Sorella Preoccupata",
    text: [
      {
        title: "Aprire la Strada",
        description:
          "Quando giochi questo personaggio, paga 2 {I} in meno per giocare il tuo prossimo luogo per questo turno.",
      },
    ],
  },
};
