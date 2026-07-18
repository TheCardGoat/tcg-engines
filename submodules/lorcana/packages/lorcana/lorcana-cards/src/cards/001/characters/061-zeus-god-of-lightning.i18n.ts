import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zeusGodOfLightningI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zeus",
    version: "God of Lightning",
    text: [
      {
        title: "Rush",
      },
      {
        title: "Challenger +4",
      },
    ],
  },
  de: {
    name: "Zeus",
    version: "Gott der Blitze",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "<Herausfordern> +4 (Während dieser Charakter herausfordert, erhält er +4 {S}.)",
      },
    ],
  },
  fr: {
    name: "ZEUS",
    version: "Dieu de la Foudre",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "<Offensif> +4",
      },
    ],
  },
  it: {
    name: "Zeus",
    version: "God of Lightning",
    text: [
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "<Challenger> +4 (While challenging, this character gets +4 {S}.)",
      },
    ],
  },
  es: {
    name: "Zeus",
    version: "Dios del rayo",
    text: [
      {
        title: "Correr",
      },
      {
        title: "Retador +4",
      },
    ],
  },
};
