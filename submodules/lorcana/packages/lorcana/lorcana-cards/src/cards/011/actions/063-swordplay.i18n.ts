import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const swordplayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Swordplay",
    text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  },
  de: {
    name: "Schwertkunst",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Herausfordern +3. (Während der Charakter herausfordert, erhält er +3.)",
  },
  fr: {
    name: "Manier l'épée",
    text: "Choisissez un personnage qui gagne Offensif +3 pour le reste de ce tour.",
  },
  it: {
    name: "Abilità con la Spada",
    text: "Un personaggio a tua scelta ottiene Sfidante +3 per questo turno.",
  },
};
