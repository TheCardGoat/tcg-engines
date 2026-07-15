import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeEricDashingAndBraveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Eric",
    version: "Dashing and Brave",
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
    name: "Prinz Eric",
    version: "Elegant und kühn",
    text: "<Herausfordern> +2 (Während dieser Charakter herausfordert, erhält er +2 {S}.)",
  },
  fr: {
    name: "PRINCE ERIC",
    version: "Fougueux et courageux",
    text: "<Offensif> +2",
  },
  it: {
    name: "Prince Eric",
    version: "Dashing and Brave",
    text: "<Challenger> +2 (While challenging, this character gets +2 {S}.)",
  },
};
