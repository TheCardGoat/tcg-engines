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
        title: "Energiewelle",
        description:
          "Dieser Charakter erhält +1 {S} für jede Karte auf der Hand aller gegnerischen Mitspielenden.",
      },
    ],
  },
  fr: {
    name: "Sisu",
    version: "Combattante enhardie",
    text: [
      {
        title: "Vague de puissance",
        description: "Ce personnage gagne +1 {S} par carte dans les mains des adversaires.",
      },
    ],
  },
  it: {
    name: "Sisu",
    version: "Guerriera Rincuorata",
    text: [
      {
        title: "Ondata di Potere",
        description: "Questo personaggio riceve +1 {S} per ogni carta in mano ai tuoi avversari.",
      },
    ],
  },
  es: {
    name: "Sisu",
    version: "Guerrero envalentonado",
    text: [
      {
        title: "AUGE DE PODER",
        description: "Este personaje obtiene +1 {S} por cada carta en la mano del oponente.",
      },
    ],
  },
};
