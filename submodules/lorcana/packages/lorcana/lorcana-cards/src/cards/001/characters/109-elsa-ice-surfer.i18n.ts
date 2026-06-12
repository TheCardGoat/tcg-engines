import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elsaIceSurferI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elsa",
    version: "Ice Surfer",
    text: [
      {
        title: "THAT'S NO BLIZZARD",
        description:
          "Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Elsa",
    version: "Eissurferin",
    text: [
      {
        title: "DAS IST KEIN SCHNEESTURM",
        description:
          "Jedes Mal, wenn du einen Anna-Charakter ausspielst, mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "ELSA",
    version: "Surfeuse des glaces",
    text: [
      {
        title: "ÇA N'EST PAS UN BLIZZARD",
        description:
          "Lorsque vous jouez un personnage Anna, redressez ce personnage. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Surfista sul Ghiaccio",
    text: [
      {
        title: "QUELLA NON È UNA TEMPESTA",
        description:
          "Ogni volta che giochi un personaggio chiamato Anna, prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
