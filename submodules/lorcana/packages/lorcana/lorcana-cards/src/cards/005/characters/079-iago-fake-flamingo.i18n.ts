import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iagoFakeFlamingoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Iago",
    version: "Fake Flamingo",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "IN DISGUISE",
        description:
          "Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
      },
    ],
  },
  de: {
    name: "Jago",
    version: "Falscher Flamingo",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "GETARNT",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 2 weniger für die nächste Aktion, die du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Iago",
    version: "Faux flamant rose",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "DÉGUISÉ",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, la prochaine action que vous jouez ce tour-ci vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Iago",
    version: "Finto Fenicottero",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "IN INCOGNITO",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 2 in meno per giocare la tua prossima azione per questo turno.",
      },
    ],
  },
};
