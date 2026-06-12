import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const meekoSkittishScroungerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Meeko",
    version: "Skittish Scrounger",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "BOTTOMLESS PIT",
        description:
          "At the end of your turn, if this character is exerted, choose and discard a card or banish him.",
      },
    ],
  },
  de: {
    name: "Meeko",
    version: "Sprunghafter Schnorrer",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "NIMMERSATT",
        description:
          "Am Ende deines Zuges, falls dieser Charakter erschöpft ist, wähle eine Karte aus deiner Hand und wirf sie ab oder verbanne diesen Charakter.",
      },
    ],
  },
  fr: {
    name: "Meeko",
    version: "Pique-assiette craintif",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "VENTRE",
        description:
          "À QUATRE PATTES À la fin de votre tour, si ce personnage est épuisé, défaussez une carte ou bannissez-le.",
      },
    ],
  },
  it: {
    name: "Meeko",
    version: "Scroccone Irrequieto",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "POZZO SENZA FONDO",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, scegli e scarta una carta o esilialo.",
      },
    ],
  },
};
