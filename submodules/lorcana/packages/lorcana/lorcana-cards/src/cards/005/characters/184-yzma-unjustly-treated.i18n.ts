import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yzmaUnjustlyTreatedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yzma",
    version: "Unjustly Treated",
    text: [
      {
        title: "I'M WARNING YOU!",
        description:
          "During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Isma",
    version: "Ungerecht behandelt",
    text: [
      {
        title: "ICH WARNE DICH!",
        description:
          "Jedes Mal, wenn einer deiner Charaktere in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du einem Charakter deiner Wahl 1 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Yzma",
    version: "Injustement traitée",
    text: [
      {
        title: "JE T'AVERTIS!",
        description:
          "Durant votre tour, chaque fois que l'un de vos personnages en bannit un autre via un défi, vous pouvez choisir un personnage et lui infliger 1 dommage.",
      },
    ],
  },
  it: {
    name: "Yzma",
    version: "Trattata Ingiustamente",
    text: [
      {
        title: "STAI BEN ATTENTO!",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi esilia un altro personaggio in una sfida, puoi infliggere 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
