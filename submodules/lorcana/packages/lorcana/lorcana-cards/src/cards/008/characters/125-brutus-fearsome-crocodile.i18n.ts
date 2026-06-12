import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const brutusFearsomeCrocodileI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Brutus",
    version: "Fearsome Crocodile",
    text: [
      {
        title: "SPITEFUL",
        description:
          "During your turn, when this character is banished, if one of your characters took damage this turn, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Brutus, das Krokodil",
    version: "Furchterregendes Krokodil",
    text: [
      {
        title: "BISSIG",
        description:
          "Wenn dieser Charakter in deinem Zug verbannt wird, falls in diesem Zug einer deiner Charaktere beschädigt wurde, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Brutus",
    version: "Redoutable crocodile",
    text: [
      {
        title: "MALVEILLANT",
        description:
          "Durant votre tour, lorsque ce personnage est banni, si l'un de vos personnages a subi un dommage ou plus ce tour-ci, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Bruto",
    version: "Coccodrillo Spaventoso",
    text: [
      {
        title: "MALEVOLO",
        description:
          "Durante il tuo turno, quando questo personaggio viene esiliato, se uno dei tuoi personaggi è stato danneggiato in questo turno, ottieni 2 leggenda.",
      },
    ],
  },
};
