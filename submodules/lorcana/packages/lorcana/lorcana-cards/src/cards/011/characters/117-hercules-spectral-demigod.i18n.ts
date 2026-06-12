import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesSpectralDemigodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Spectral Demigod",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "SUPERHUMAN STRENGTH",
        description: "While there's a card under this character, he gets +3 {S}.",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Spektraler Halbgott",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "ÜBERMENSCHLICHE KRAFT",
        description: "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +3.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Demi-dieu spectral",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "FORCE SURHUMAINE",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +3.",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Semidio Spettrale",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "FORZA SOVRUMANA",
        description: "Mentre c'è una carta sotto a questo personaggio, riceve +3.",
      },
    ],
  },
};
