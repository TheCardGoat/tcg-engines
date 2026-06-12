import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanFearlessFighterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Fearless Fighter",
    text: "Rush",
  },
  de: {
    name: "Peter Pan",
    version: "Furchtloser Kämpfer",
    text: "Rasant",
  },
  fr: {
    name: "PETER PAN",
    version: "Combattant intrépide",
    text: "Charge",
  },
  it: {
    name: "Peter Pan",
    version: "Fearless Fighter",
    text: [
      {
        title: "Rush",
        description: "(This character can challenge the turn they're played.)",
      },
    ],
  },
};
