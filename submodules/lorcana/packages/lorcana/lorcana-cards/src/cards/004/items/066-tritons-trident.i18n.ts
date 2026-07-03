import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tritonsTridentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Triton's Trident",
    text: [
      {
        title: "SYMBOL OF POWER",
        description:
          "Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
      },
    ],
  },
  de: {
    name: "Tritons Dreizack",
    text: [
      {
        title: "Symbol der Macht",
        description:
          "Verbanne diesen Gegenstand — Gib einem Charakter deiner Wahl in diesem Zug +1 {S} für jede Karte auf deiner Hand.",
      },
    ],
  },
  fr: {
    name: "Trident de Triton",
    text: [
      {
        title: "Symbole de Pouvoir",
        description:
          "Bannissez cet objet — Choisissez un personnage qui gagne +1 {S} par carte dans votre main pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Il Tridente di Tritone",
    text: [
      {
        title: "Simbolo di Potere",
        description:
          "Esilia questo oggetto — Un personaggio a tua scelta riceve +1 {S} per questo turno per ogni carta che hai in mano.",
      },
    ],
  },
};
