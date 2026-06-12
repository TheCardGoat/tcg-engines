import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonDespicableDealerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Despicable Dealer",
    text: [
      {
        title: "DUBIOUS RECRUITMENT",
        description: "{E} — You pay 2 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Gaston",
    version: "Verruchter Händler",
    text: [
      {
        title: "ZWEIFELHAFTE REKRUTIERUNG",
        description:
          "— Du zahlst 2 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Odieux comploteur",
    text: [
      {
        title: "RECRUTEMENT DOUTEUX",
        description: "— Le prochain personnage que vous jouez durant ce tour coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Spregevole Trafficante",
    text: [
      {
        title: "RECLUTAMENTO SOSPETTO",
        description: "— Paga 2 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
