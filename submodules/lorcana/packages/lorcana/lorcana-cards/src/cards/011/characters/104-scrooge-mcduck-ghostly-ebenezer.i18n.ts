import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckGhostlyEbenezerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Ghostly Ebenezer",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "COUNTING COINS",
        description: "This character gets +1 {S} and +1 {W} for each card under him.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Geisterhafter Ebenezer",
    text: [
      {
        title: "Stärken 1",
      },
      {
        title: "MÜNZEN ZÄHLEN",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1 und +1.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Ebenezer fantôme",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "COMPTANT LES PIÈCES",
        description: "Ce personnage gagne +1 et +1 pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Ebenezer Spettrale",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "CONTARE LE MONETE",
        description: "Questo personaggio riceve +1 e +1 per ogni carta sotto di sé.",
      },
    ],
  },
};
