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
        title: "Zweifelhafte Rekrutierung",
        description:
          "{E} — Du zahlst 2 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Odieux comploteur",
    text: [
      {
        title: "Recrutement douteux",
        description:
          "{E} — Le prochain personnage que vous jouez durant ce tour coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Spregevole Trafficante",
    text: [
      {
        title: "Reclutamento Sospetto",
        description:
          "{E} — Paga 2 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
  es: {
    name: "Gastón",
    version: "Distribuidor despreciable",
    text: [
      {
        title: "RECLUTAMIENTO DUDOSO",
        description: "{E}: pagas 2 {I} menos por el siguiente personaje que juegues en este turno.",
      },
    ],
  },
};
