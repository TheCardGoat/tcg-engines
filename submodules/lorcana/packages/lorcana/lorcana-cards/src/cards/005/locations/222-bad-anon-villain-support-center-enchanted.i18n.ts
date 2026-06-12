import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const badanonVillainSupportCenterEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bad-Anon",
    version: "Villain Support Center",
    text: [
      {
        title: "THERE'S NO ONE I'D RATHER BE THAN ME",
        description:
          'Villain characters gain "{E}, 3 {I} — Play a character with the same name as this character for free" while here.',
      },
    ],
  },
  de: {
    name: "Anonyme Bösewichte",
    version: "Zentrum für Schurkenunterstützung",
    text: [
      {
        title: "ICH",
        description:
          'MÖCHTE KEIN ANDERER SEIN ALS ICH Deine Schurken an diesem Ort erhalten: ", 3 — Spiele einen Charakter, mit demselben Namen wie dieser Charakter, kostenlos aus."',
      },
    ],
  },
  fr: {
    name: "Méchants anonymes",
    version: "Centre de soutien des méchants",
    text: [
      {
        title: "JE NE VOUDRAIS",
        description:
          'ÊTRE PERSONNE D\'AUTRE QUE MOI Les personnages Méchant sur ce lieu gagnent ", 3 — Jouez gratuitement un personnage avec le même nom que celui-ci."',
      },
    ],
  },
  it: {
    name: "Cattivi Anonimi",
    version: "Centro Assistenza Cattivi",
    text: [
      {
        title: "NON VORREI ESSERE NESSUN ALTRO A PARTE ME I",
        description:
          'personaggi Cattivo ottengono ", 3 — Gioca un personaggio con lo stesso nome di questo personaggio, gratis" mentre si trovano in questo luogo.',
      },
    ],
  },
};
