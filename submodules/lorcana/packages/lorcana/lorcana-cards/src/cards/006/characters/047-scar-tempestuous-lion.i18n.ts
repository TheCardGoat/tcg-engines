import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarTempestuousLionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Tempestuous Lion",
    text: [
      {
        title: "Rush",
      },
      {
        title: "Challenger +3",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Temperamentvoller Löwe",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "<Herausfordern> +3 (Während dieser Charakter herausfordert, erhält er +3 {S}.)",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Lion tempétueux",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "<Offensif> +3",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Leone Tempestoso",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "<Sfidante> +3",
      },
    ],
  },
};
