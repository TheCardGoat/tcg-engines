import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaSeaWitchEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Sea Witch",
    text: [
      {
        title: "YOU'RE TOO LATE",
        description:
          "Whenever this character quests, chosen opposing character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Ursula",
    version: "Seehexe",
    text: [
      {
        title: "ZU SPÄT!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle einen gegnerischen Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Sorcière des mers",
    text: [
      {
        title: "TROP TARD",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse qui ne pourra pas être redressé au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Ursula",
    version: "Strega del Mare",
    text: [
      {
        title: "ORMAI È TROPPO TARDI",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
