import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mostEveryonesMadHereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Most Everyone's Mad Here",
    text: "Gain lore equal to the damage on chosen character, then banish them.",
  },
  de: {
    name: "Die meisten von uns hier sind verrückt",
    text: "Wähle einen Charakter und zähle den Schaden auf ihm. Sammle diese Anzahl an Legenden und verbanne ihn.",
  },
  fr: {
    name: "Tout le monde est fou ici",
    text: "Choisissez un personnage et gagnez autant d'éclats de Lore qu'il a de dommages sur lui, puis bannissez-le.",
  },
  it: {
    name: "Sono Quasi Tutti Matti Qui",
    text: "Ottieni leggenda pari al danno su un personaggio a tua scelta, poi esilialo.",
  },
};
