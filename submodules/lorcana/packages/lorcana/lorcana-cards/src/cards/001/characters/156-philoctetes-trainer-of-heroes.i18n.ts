import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const philoctetesTrainerOfHeroesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Philoctetes",
    version: "Trainer of Heroes",
    text: "Support",
  },
  de: {
    name: "Phil",
    version: "Trainer der Helden",
    text: "Unterstützen (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "PHILOCTÈTE",
    version: "Entraineur de héros",
    text: "Soutien",
  },
  it: {
    name: "Philoctetes",
    version: "Trainer of Heroes",
    text: [
      {
        title: "Support",
        description:
          "(Whenever this character quests, you may add their to another chosen character's this turn.)",
      },
    ],
  },
};
