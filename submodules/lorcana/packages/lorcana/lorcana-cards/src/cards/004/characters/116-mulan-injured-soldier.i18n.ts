import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mulanInjuredSoldierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mulan",
    version: "Injured Soldier",
    text: [
      {
        title: "BATTLE WOUND",
        description: "This character enters play with 2 damage.",
      },
    ],
  },
  de: {
    name: "Mulan",
    version: "Verwundete Soldatin",
    text: [
      {
        title: "KRIEGSWUNDE",
        description: "Dieser Charakter kommt mit 2 Schaden auf ihm ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Mulan",
    version: "Soldate blessée",
    text: [
      {
        title: "BLESSURE AU COMBAT",
        description: "Ce personnage entre en jeu avec 2 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Mulan",
    version: "Guerriera Ferita",
    text: [
      {
        title: "FERITA DA COMBATTIMENTO",
        description: "Questo personaggio entra in gioco con 2 danni.",
      },
    ],
  },
};
