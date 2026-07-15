import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const duckburgFunsosFunzoneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Duckburg",
    version: "Funso’s Funzone",
    text: [
      {
        title: "Where Fun Is in the Zone",
        description:
          "Whenever a character quests while here, you pay 2 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Entenhausen",
    version: "Fonsos Funpark",
    text: [
      {
        title: "Für Spaß, wie ich ihn mag",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort erkundet, zahlst du 2 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Canardville",
    version: "Au pays des jeux de Funso",
    text: [
      {
        title: "Funso fait des heureux",
        description:
          "Chaque fois qu'un personnage sur ce lieu est envoyé à l'aventure, le prochain personnage que vous jouez ce tour-ci vous coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Paperopoli",
    version: "Casa dello Spasso di Spassi",
    text: [
      {
        title: "La Casa dello Spasso",
        description:
          "Ogni volta che un personaggio va all'avventura mentre si trova in questo luogo, paga 2 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
