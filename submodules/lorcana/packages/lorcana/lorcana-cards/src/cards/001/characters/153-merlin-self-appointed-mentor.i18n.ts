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
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "MERLIN",
    version: "Mentor autoproclamé",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Merlin",
    version: "Self-Appointed Mentor",
    text: "<Support> (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  },
};
