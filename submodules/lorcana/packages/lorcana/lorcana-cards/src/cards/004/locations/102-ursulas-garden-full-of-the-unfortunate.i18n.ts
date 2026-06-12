import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulasGardenFullOfTheUnfortunateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula’s Garden",
    version: "Full of the Unfortunate",
    text: [
      {
        title: "ABANDON HOPE",
        description: "While you have an exerted character here, opposing characters get -1 {L}.",
      },
    ],
  },
  de: {
    name: "Ursulas Garten",
    version: "Voll von Seelen in Not",
    text: [
      {
        title: "DIE HOFFNUNG VERLIEREN",
        description:
          "Solange du mindestens einen erschöpften Charakter an diesem Ort hast, erhalten gegnerische Charaktere -1.",
      },
    ],
  },
  fr: {
    name: "Jardin d'Ursula",
    version: "Rempli d'âmes en perdition",
    text: [
      {
        title: "ESPOIR PERDU",
        description:
          "Tant que vous avez au moins un personnage épuisé sur ce lieu, les personnages adverses subissent -1.",
      },
    ],
  },
  it: {
    name: "Il Giardino di Ursula",
    version: "Pieno di Anime Sole",
    text: [
      {
        title: "ABBANDONARE OGNI SPERANZA",
        description:
          "Mentre hai un personaggio impegnato in questo luogo, i personaggi avversari ricevono -1.",
      },
    ],
  },
};
