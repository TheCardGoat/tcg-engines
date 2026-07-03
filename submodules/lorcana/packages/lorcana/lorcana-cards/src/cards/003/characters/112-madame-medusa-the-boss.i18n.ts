import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madameMedusaTheBossI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madame Medusa",
    version: "The Boss",
    text: [
      {
        title: "THAT TERRIBLE WOMAN",
        description:
          "When you play this character, banish chosen opposing character with 3 {S} or less.",
      },
    ],
  },
  de: {
    name: "Madam Medusa",
    version: "Die Chefin",
    text: [
      {
        title: "Diese Furchtbare Frau",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne einen gegnerischen Charakter deiner Wahl mit 3 oder weniger {S}.",
      },
    ],
  },
  fr: {
    name: "Madame Médusa",
    version: "La patronne",
    text: [
      {
        title: "Je vous pulvérise",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse avec 3 {S} ou moins et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Madame Medusa",
    version: "Il Boss",
    text: [
      {
        title: "Quell'Orribile Donna",
        description:
          "Quando giochi questo personaggio, esilia un personaggio avversario a tua scelta con 3 {S} o inferiore.",
      },
    ],
  },
};
