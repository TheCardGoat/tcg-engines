import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const workTogetherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Work Together",
    text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  },
  de: {
    name: "Teamwork",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "TRAVAIL D'ÉQUIPE",
    text: "Choisissez un personnage, il gagne Soutien pour le reste de ce tour.",
  },
  it: {
    name: "Work Together",
    text: "Chosen character gains Support this turn. (Whenever they quest, you may add their to another chosen character's this turn.)",
  },
};
