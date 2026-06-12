import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const unconventionalToolI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Unconventional Tool",
    text: [
      {
        title: "FIXED IN NO TIME",
        description:
          "When this item is banished, you pay 2 {I} less for the next item you play this turn.",
      },
    ],
  },
  de: {
    name: "Unkonventionelles Werkzeug",
    text: [
      {
        title: "IM HANDUMDREHEN REPARIERT",
        description:
          "Wenn dieser Gegenstand verbannt wird, zahlst du 2 weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Outil inhabituel",
    text: [
      {
        title: "RÉPARÉ EN UN CLIN D'ŒIL",
        description:
          "Lorsque cet objet est banni, le prochain objet que vous jouez ce tour-ci vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Strumento non Convenzionale",
    text: [
      {
        title: "AGGIUSTATO IN UN MOMENTO",
        description:
          "Quando questo oggetto viene esiliato, paga 2 in meno per giocare il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
};
