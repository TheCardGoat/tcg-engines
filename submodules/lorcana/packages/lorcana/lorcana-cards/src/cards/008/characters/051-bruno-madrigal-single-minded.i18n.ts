import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const brunoMadrigalSinglemindedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bruno Madrigal",
    version: "Single-Minded",
    text: [
      {
        title: "STANDING TALL",
        description:
          "When you play this character, chosen opposing character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Bruno Madrigal",
    version: "Zielstrebig",
    text: [
      {
        title: "STEHT AUFRECHT",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen gegnerischen Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Bruno Madrigal",
    version: "Obsessionnel",
    text: [
      {
        title: "FIÈREMENT DRESSÉ",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Bruno Madrigal",
    version: "Determinato",
    text: [
      {
        title: "A TESTA ALTA",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
