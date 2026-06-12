import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const auroraHoldingCourtEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aurora",
    version: "Holding Court",
    text: [
      {
        title: "ROYAL WELCOME",
        description:
          "Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
      },
    ],
  },
  de: {
    name: "Aurora",
    version: "Hält Hof",
    text: [
      {
        title: "KÖNIGLICHER EMPFANG",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 1 weniger für die nächste Prinzessin oder Königin, die du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Aurore",
    version: "Tient audiance",
    text: [
      {
        title: "ACCUEIL ROYAL",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, le prochain personnage Reine ou Princesse que vous jouez ce tour-ci vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Aurora",
    version: "In Ricevimento a Corte",
    text: [
      {
        title: "BENVENUTO REALE",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 1 in meno per giocare il tuo prossimo personaggio Principessa o Regina per questo turno.",
      },
    ],
  },
};
