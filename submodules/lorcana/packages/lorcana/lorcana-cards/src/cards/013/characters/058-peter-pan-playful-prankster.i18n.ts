import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanPlayfulPranksterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Playful Prankster",
    text: [
      {
        title: "STAY RIGHT THERE",
        description:
          "When you play this character, chosen opposing character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Peter Pan",
    version: "Verspielter Scherzbold",
    text: [
      {
        title: "Bleib genau da",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen gegnerischen Charakter. Jener wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Peter Pan",
    version: "Farceur espiègle",
    text: [
      {
        title: "Reste là",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Peter Pan",
    version: "Burlone Giocoso",
    text: [
      {
        title: "Resta Lì Dove Sei",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
