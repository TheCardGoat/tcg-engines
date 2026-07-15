import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const starkeyHooksHenchmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Starkey",
    version: "Hook’s Henchman",
    text: [
      {
        title: "Aye Aye, Captain",
        description: "While you have a Captain character in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Starkey",
    version: "Hooks Handlanger",
    text: [
      {
        title: "Aye, Aye, Käpt'n",
        description:
          "Dieser Charakter erhält +1 {L}, solange du mindestens eine Kapitänin oder einen Kapitän im Spiel hast.",
      },
    ],
  },
  fr: {
    name: "MONSIEUR STARKEY",
    version: "Acolyte de Crochet",
    text: [
      {
        title: "OUI, CAPITAINE",
        description:
          "Ce personnage a +1 {L} tant que vous avez au moins un personnage Capitaine en jeu.",
      },
    ],
  },
  it: {
    name: "Starkey",
    version: "Hook’s Henchman",
    text: [
      {
        title: "Aye Aye, Captain",
        description: "While you have a Captain character in play, this character gets +1 {L}.",
      },
    ],
  },
};
