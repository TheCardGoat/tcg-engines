import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const attackOfTheVineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Attack of the Vine!",
    text: "Your Floodborn characters gain Resist +2 and can challenge ready characters this turn.",
  },
  de: {
    name: "Angriff der Ranke!",
    text: "Deine Flutgestalt-Charaktere erhalten in diesem Zug <Robust> +2 und können bereite Charaktere herausfordern. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 2.)",
  },
  fr: {
    name: "Invasion épineuse !",
    text: "Vos personnages Floodborn gagnent <Résistance> +2 et peuvent défier les personnages redressés pour le reste de ce tour.",
  },
  it: {
    name: "Viticcio all'Attacco!",
    text: "I tuoi personaggi Imbevuto ottengono <Resistere> +2 e possono sfidare i personaggi preparati per questo turno.",
  },
};
