import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseTrumpeterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Trumpeter",
    text: [
      {
        title: "SOUND THE CALL",
        description: "{E}, 2 {I} — Play a character for free.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Trompeter",
    text: [
      {
        title: "Der Ruf erklingt",
        description: "{E}, 2 {I} — Spiele einen Charakter kostenlos aus.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Trompettiste",
    text: [
      {
        title: "Sonne l'appel",
        description: "{E}, 2 {I} — Jouez gratuitement un personnage.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Trombettiere",
    text: [
      {
        title: "Dare il Segnale",
        description: "{E}, 2 {I} — Gioca un personaggio gratis.",
      },
    ],
  },
};
