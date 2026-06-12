import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gumboPotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gumbo Pot",
    text: [
      {
        title: "THE BEST I'VE EVER TASTED",
        description: "{E} — Remove 1 damage each from up to 2 chosen characters.",
      },
    ],
  },
  de: {
    name: "Gumbo Eintopf",
    text: [
      {
        title: "DAS BESTE GUMBO, DAS ICH JE PROBIERT HAB",
        description: "— Entferne jeweils 1 Schaden von bis zu 2 Charakteren deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Marmite de Gumbo",
    text: "Le meilleur gumbo que j'ai jamais goûté\\ — Choisissez jusqu'à 2 personnages et retirez-leur 1 jeton Dommage chacun.",
  },
  it: {
    name: "Gumbo Pot",
    text: [
      {
        title: "THE BEST I'VE EVER TASTED",
        description: "— Remove 1 damage each from up to 2 chosen characters.",
      },
    ],
  },
};
