import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaIceBreakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Ice Breaker",
    text: [
      {
        title: "Support",
      },
      {
        title: "WINTER AMBUSH",
        description:
          "When you play this character, chosen opposing character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Eisbrecherin",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "WINTERLICHER HINTERHALT",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen gegnerischen Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Briseuse de glace",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "EMBUSCADE GLACIALE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Rompighiaccio",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "IMBOSCATA INVERNALE",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
