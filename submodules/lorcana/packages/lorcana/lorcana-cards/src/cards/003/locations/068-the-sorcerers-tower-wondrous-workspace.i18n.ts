import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSorcerersTowerWondrousWorkspaceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sorcerer's Tower",
    version: "Wondrous Workspace",
    text: [
      {
        title: "BROOM CLOSET",
        description: "Your characters named Magic Broom may move here for free.",
      },
      {
        title: "MAGICAL POWER",
        description: "Characters get +1 {L} while here.",
      },
    ],
  },
  de: {
    name: "Der Mystische Turm",
    version: "Wunderbarer Arbeitsraum",
    text: [
      {
        title: "BESENKAMMER",
        description: "Deine Zauberbesen-Charaktere können sich kostenlos zu diesem Ort bewegen.",
      },
      {
        title: "MAGISCHE FÄHIGKEITEN",
        description: "Charaktere an diesem Ort erhalten +1.",
      },
    ],
  },
  fr: {
    name: "La Tour du Sorcier",
    version: "Atelier merveilleux",
    text: [
      {
        title: "PLACARD À BALAIS",
        description:
          "Vous pouvez déplacer gratuitement vos personnages Balais Magiques sur ce lieu.",
      },
      {
        title: "POUVOIR MAGIQUE",
        description: "Les personnages sur ce lieu gagnent +1.",
      },
    ],
  },
  it: {
    name: "La Torre dello Stregone",
    version: "Laboratorio Meraviglioso",
    text: [
      {
        title: "RIPOSTIGLIO DELLE SCOPE I",
        description:
          "tuoi personaggi chiamati Scopa Magica possono spostarsi in questo luogo gratis.",
      },
      {
        title: "POTERE MAGICO I",
        description: "personaggi ricevono +1 mentre si trovano in questo luogo.",
      },
    ],
  },
};
