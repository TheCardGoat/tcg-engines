import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleInventiveEngineerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Inventive Engineer",
    text: [
      {
        title: "TINKER",
        description:
          "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Ideenreiche Ingenieurin",
    text: [
      {
        title: "TÜFTELN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 1 weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "BELLE",
    version: "Inventrice",
    text: [
      {
        title: "BRICOLEUSE",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, le prochain objet que vous jouez durant ce tour coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Ingegnera Creativa",
    text: [
      {
        title: "INVENTRICE",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 1 in meno per giocare il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
};
