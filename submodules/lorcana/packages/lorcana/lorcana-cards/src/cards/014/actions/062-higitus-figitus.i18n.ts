import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const higitusFigitusI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Higitus Figitus",
    text: "Get 3 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
  },
  de: {
    name: "Higitus Pigitus",
    text: "Erschaffe 3 Tintentropfen. (Ein Tintentropfen kann entfernt werden, um 1 {I} zu bezahlen.)",
  },
  fr: {
    name: "Higitus Figitus",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Gagnez 3 gouttes d'encre. (Vous pouvez retirer l'une de vos gouttes d'encre pour payer 1 {I}.)",
      },
    ],
  },
  it: {
    name: "Igitus Figitus",
    text: [
      {
        title:
          "(Un personaggio con costo 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Ricevi 3 gocce d'inchiostro. (Ogni goccia d'inchiostro può essere rimossa per pagare 1 {I}.)",
      },
    ],
  },
  es: {
    name: "Higitus Figitus",
    text: "Get 3 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
  },
};
