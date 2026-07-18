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
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Joyeux",
    version: "De nature joviale",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Happy",
    version: "Good-Natured",
    text: "<Support> (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  },
  es: {
    name: "Feliz",
    version: "De buen carácter",
    text: "Apoyo",
  },
};
