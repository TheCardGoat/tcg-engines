import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const oneAndOnlyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "One and Only",
    text: "Choose a character. Banish all other characters with the same name as that character.",
  },
  de: {
    name: "Einzig und allein",
    text: "Wähle einen Charakter. Verbanne alle anderen gleichnamigen Charaktere.",
  },
  fr: {
    name: "Le seul et unique",
    text: "Choisissez un personnage. Bannissez tous les autres personnages portant le même nom que le personnage choisi.",
  },
  it: {
    name: "L'Unico e il Solo",
    text: "Scegli un personaggio. Esilia tutti gli altri personaggi con lo stesso nome di quel personaggio.",
  },
  es: {
    name: "Uno y solo",
    text: "Elige un personaje. Destierra a todos los demás personajes con el mismo nombre que ese personaje.",
  },
};
