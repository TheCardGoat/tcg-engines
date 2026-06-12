import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const viciousBetrayalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vicious Betrayal",
    text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  },
  de: {
    name: "Grauenhafter Verrat",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +2. Wählst du eine Schurkin oder einen Schurken, dann gib dem Charakter stattdessen +3.",
  },
  fr: {
    name: "TRAHISON BRUTALE",
    text: "Choisissez un personnage, il gagne +2 pour le reste de ce tour. S'il s'agit d'un personnage Méchant, il gagne +3 à la place.",
  },
  it: {
    name: "Vicious Betrayal",
    text: "Chosen character gets +2 this turn. If a Villain character is chosen, they get +3 instead.",
  },
};
