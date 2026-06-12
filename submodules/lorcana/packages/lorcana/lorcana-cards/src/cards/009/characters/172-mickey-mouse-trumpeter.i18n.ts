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
        title: "DER RUF ERKLINGT, 2",
        description: "— Spiele einen Charakter kostenlos aus.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Trompettiste",
    text: [
      {
        title: "SONNE L'APPEL, 2",
        description: "— Jouez gratuitement un personnage.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Trombettiere",
    text: [
      {
        title: "DARE IL SEGNALE, 2",
        description: "— Gioca un personaggio gratis.",
      },
    ],
  },
};
