import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseDaringDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Daring Defender",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "TRUE VALOR",
        description: "This character gets +1 {S} for each 1 damage on her.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Wagemutige Beschützerin",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "WAHRE TAPFERKEIT",
        description: "Dieser Charakter erhält +1 für jeden Schaden auf ihm.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Défenseuse hardie",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "BRAVOURE VÉRITABLE",
        description: "Ce personnage gagne +1 pour chaque dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Difenditrice Coraggiosa",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "VERO VALORE",
        description: "Questo personaggio riceve +1 per ogni singolo danno su di esso.",
      },
    ],
  },
};
