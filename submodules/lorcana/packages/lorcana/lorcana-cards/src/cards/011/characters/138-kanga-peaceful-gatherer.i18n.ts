import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kangaPeacefulGathererI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kanga",
    version: "Peaceful Gatherer",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "EXTRA HELP",
        description: "While there's a card under this character, she gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Kanga",
    version: "Friedliche Sammlerin",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "ZUSÄTZLICHE HILFE",
        description: "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +1.",
      },
    ],
  },
  fr: {
    name: "Maman Gourou",
    version: "Cueilleuse paisible",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "PETITE AIDE EN PLUS",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +1.",
      },
    ],
  },
  it: {
    name: "Kanga",
    version: "Raccoglitrice Serena",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "AIUTO AGGIUNTIVO",
        description: "Mentre c'è una carta sotto a questo personaggio, riceve +1.",
      },
    ],
  },
};
