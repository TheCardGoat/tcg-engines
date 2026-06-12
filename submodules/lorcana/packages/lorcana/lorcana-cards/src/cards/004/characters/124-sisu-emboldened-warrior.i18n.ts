import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sisuEmboldenedWarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sisu",
    version: "Emboldened Warrior",
    text: [
      {
        title: "SURGE OF POWER",
        description: "This character gets +1 {S} for each card in opponents' hands.",
      },
    ],
  },
  de: {
    name: "Sisu",
    version: "Mutige Kriegerin",
    text: [
      {
        title: "ENERGIEWELLE",
        description:
          "Dieser Charakter erhält +1 für jede Karte auf der Hand aller gegnerischen Mitspielenden.",
      },
    ],
  },
  fr: {
    name: "Sisu",
    version: "Combattante enhardie",
    text: [
      {
        title: "VAGUE DE PUISSANCE",
        description: "Ce personnage gagne +1 par carte dans les mains des adversaires.",
      },
    ],
  },
  it: {
    name: "Sisu",
    version: "Guerriera Rincuorata",
    text: [
      {
        title: "ONDATA DI POTERE",
        description: "Questo personaggio riceve +1 per ogni carta in mano ai tuoi avversari.",
      },
    ],
  },
};
