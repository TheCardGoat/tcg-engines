import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hueyReliableLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Huey",
    version: "Reliable Leader",
    text: [
      {
        title: "I KNOW THE WAY",
        description:
          "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Tick Duck",
    version: "Verlässlicher Anführer",
    text: [
      {
        title: "Ich kenne den Weg",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 1 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Riri",
    version: "Leader sérieux",
    text: [
      {
        title: "Je connais le chemin",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, le prochain personnage que vous jouez ce tour-ci vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Qui",
    version: "Leader Affidabile",
    text: [
      {
        title: "Conosco la Strada",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 1 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
