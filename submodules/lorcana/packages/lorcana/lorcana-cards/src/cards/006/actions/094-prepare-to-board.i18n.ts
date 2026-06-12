import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const prepareToBoardI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prepare to Board!",
    text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  },
  de: {
    name: "Bereit zum Entern!",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +2. Wählst du einen Piraten, dann gib dem Charakter stattdessen +3.",
  },
  fr: {
    name: "Paré à l'abordage !",
    text: "Choisissez un personnage qui gagne +2 pour le reste de ce tour. Si un personnage Pirate est choisi de cette façon, il gagne +3 à la place.",
  },
  it: {
    name: "Prepararsi all'Abbordaggio!",
    text: "Un personaggio a tua scelta riceve +2 per questo turno. Se viene scelto un personaggio Pirata, riceve invece +3.",
  },
};
