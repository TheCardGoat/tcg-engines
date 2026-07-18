import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const drFaciliersCardsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dr. Facilier’s Cards",
    text: [
      {
        title: "The Cards Will Tell",
        description: "{E} — You pay 1 {I} less for the next action you play this turn.",
      },
    ],
  },
  de: {
    name: "Dr. Faciliers Karten",
    text: [
      {
        title: "In den Karten steht's",
        description:
          "{E} — Du zahlst 1 {I} weniger für die nächste Aktion, die du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "CARTES DU DR. FACILIER",
    text: [
      {
        title: "DIVINATION",
        description:
          "{E} — La prochaine carte action que vous jouez durant ce tour coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Dr. Facilier’s Cards",
    text: [
      {
        title: "The Cards Will Tell",
        description: "{E} — You pay 1 {I} less for the next action you play this turn.",
      },
    ],
  },
  es: {
    name: "Tarjetas del Dr. Facilier",
    text: [
      {
        title: "Las cartas lo dirán",
        description: "{E}: pagas 1 {I} menos por la siguiente acción que juegues en este turno.",
      },
    ],
  },
};
