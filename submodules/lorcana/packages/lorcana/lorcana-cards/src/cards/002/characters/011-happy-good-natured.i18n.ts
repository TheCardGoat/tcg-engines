import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const happyGoodnaturedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Happy",
    version: "Good-Natured",
    text: "Support",
  },
  de: {
    name: "Happy",
    version: "Gutmütig",
    text: "Unterstützen (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Joyeux",
    version: "De nature joviale",
    text: "Soutien",
  },
  it: {
    name: "Happy",
    version: "Good-Natured",
    text: [
      {
        title: "Support",
        description:
          "(Whenever this character quests, you may add their to another chosen character's this turn.)",
      },
    ],
  },
};
