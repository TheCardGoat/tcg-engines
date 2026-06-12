import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomDancingDusterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Dancing Duster",
    text: [
      {
        title: "POWER CLEAN",
        description:
          "When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Tanzender Staubwedel",
    text: [
      {
        title: "KRAFTREINIGER",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen Magier oder eine Magierin im Spiel hast, darfst du einen gegnerischen Charakter deiner Wahl erschöpfen. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Balais magiques",
    version: "Plumeau dansant",
    text: [
      {
        title: "NETTOYAGE À FOND",
        description:
          "Si vous avez un personnage Mage en jeu lorsque vous jouez ce personnage, vous pouvez choisir un personnage adverse et l'épuiser. Il ne pourra pas être redressé au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Spolverino Danzante",
    text: [
      {
        title: "PULIZIA ENERGICA",
        description:
          "Quando giochi questo personaggio, se hai un personaggio Incantatore in gioco, puoi impegnare un personaggio avversario a tua scelta. Quel personaggio non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
