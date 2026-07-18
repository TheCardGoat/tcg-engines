import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pinocchioStringsAttachedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pinocchio",
    version: "Strings Attached",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "GOT TO KEEP REAL QUIET",
        description:
          "Once during your turn, whenever you ready this character, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Pinocchio",
    version: "An Fäden geknüpft",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Ich muss ganz leise sein",
        description:
          "Einmal während deines Zuges, wenn du diesen Charakter bereit machst, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Pinocchio",
    version: "Avec des liens",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Ne faisons pas un bruit",
        description:
          "Une fois durant votre tour, lorsque vous redressez ce personnage, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Pinocchio",
    version: "Strings Attached",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "Got to Keep Real Quiet",
        description:
          "Once during your turn, whenever you ready this character, you may draw a card.",
      },
    ],
  },
  es: {
    name: "Pinocho",
    version: "Cuerdas atadas",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "TENGO QUE MANTENER MUCHO SILENCIO",
        description:
          "Una vez durante tu turno, cada vez que prepares este personaje, puedes robar una carta.",
      },
    ],
  },
};
