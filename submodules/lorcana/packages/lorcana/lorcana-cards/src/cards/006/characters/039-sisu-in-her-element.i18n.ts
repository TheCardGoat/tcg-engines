import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sisuInHerElementI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sisu",
    version: "In Her Element",
    text: [
      {
        title: "Challenger +2",
      },
      {
        title: ".",
      },
    ],
  },
  de: {
    name: "Sisu",
    version: "In ihrem Element",
    text: "<Herausfordern> +2 (Während dieser Charakter herausfordert, erhält er +2 {S}.)",
  },
  fr: {
    name: "Sisu",
    version: "Dans son élément",
    text: "<Offensif> +2",
  },
  it: {
    name: "Sisu",
    version: "Nel Suo Elemento",
    text: "<Sfidante> +2",
  },
  es: {
    name: "Sisu",
    version: "En su elemento",
    text: [
      {
        title: "Retador +2",
      },
      {
        title: ".",
      },
    ],
  },
};
