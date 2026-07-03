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
        title: "Ich möchte kein anderer sein als ich",
        description:
          'Deine Schurken an diesem Ort erhalten: "{E}, 3 {I} — Spiele einen Charakter, mit demselben Namen wie dieser Charakter, kostenlos aus."',
      },
    ],
  },
  fr: {
    name: "Méchants anonymes",
    version: "Centre de soutien des méchants",
    text: [
      {
        title: "Je ne voudrais être personne d'autre que moi",
        description:
          'Les personnages Méchant sur ce lieu gagnent "{E}, 3 {I} — Jouez gratuitement un personnage avec le même nom que celui-ci."',
      },
    ],
  },
  it: {
    name: "Cattivi Anonimi",
    version: "Centro Assistenza Cattivi",
    text: [
      {
        title: "Non Vorrei Essere Nessun Altro a Parte Me",
        description:
          'I personaggi Cattivo ottengono "{E}, 3 {I} — Gioca un personaggio con lo stesso nome di questo personaggio, gratis" mentre si trovano in questo luogo.',
      },
    ],
  },
};
