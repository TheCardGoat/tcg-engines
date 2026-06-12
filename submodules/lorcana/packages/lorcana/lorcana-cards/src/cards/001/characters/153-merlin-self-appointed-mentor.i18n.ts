import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinSelfappointedMentorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Self-Appointed Mentor",
    text: "Support",
  },
  de: {
    name: "Merlin",
    version: "Selbsternannter Mentor",
    text: "Unterstützen (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "MERLIN",
    version: "Mentor autoproclamé",
    text: "Soutien",
  },
  it: {
    name: "Merlin",
    version: "Self-Appointed Mentor",
    text: [
      {
        title: "Support",
        description:
          "(Whenever this character quests, you may add their to another chosen character's this turn.)",
      },
    ],
  },
};
