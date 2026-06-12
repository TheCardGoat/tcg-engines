import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaWhisperOfVanessaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Whisper of Vanessa",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "SLIPPERY SPELL",
        description:
          "While there's a card under this character, she gets +1 {L} and gains Evasive.",
      },
    ],
  },
  de: {
    name: "Ursula",
    version: "Geflüster von Vanessa",
    text: [
      {
        title: "Stärken 1",
      },
      {
        title: "GERISSENER ZAUBER",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +1 und Wendig.",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Lueur de Vanessa",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "SORT ÉVASIF",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +1 et Insaisissable.",
      },
    ],
  },
  it: {
    name: "Ursula",
    version: "Sussurro di Vanessa",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "INCANTESIMO SUBDOLO",
        description:
          "Mentre c'è una carta sotto a questo personaggio, questo riceve +1 e ottiene Sfuggente. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
