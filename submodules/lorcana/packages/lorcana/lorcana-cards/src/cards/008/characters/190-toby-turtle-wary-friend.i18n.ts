import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tobyTurtleWaryFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Toby Turtle",
    version: "Wary Friend",
    text: [
      {
        title: "HARD SHELL",
        description: "While this character is exerted, he gains Resist +1.",
      },
    ],
  },
  de: {
    name: "Toby Schildkröte",
    version: "Vorsichtiger Freund",
    text: [
      {
        title: "HARTE SCHALE",
        description:
          "Solange dieser Charakter erschöpft ist, erhält er Robust +1. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Toby la Tortue",
    version: "Ami prudent",
    text: [
      {
        title: "CARAPACE SOLIDE",
        description: "Tant que ce personnage est épuisé, il gagne Résistance +1.",
      },
    ],
  },
  it: {
    name: "Tobia",
    version: "Amico Prudente",
    text: [
      {
        title: "GUSCIO DURO",
        description: "Mentre questo personaggio è impegnato, ottiene Resistere +1.",
      },
    ],
  },
};
