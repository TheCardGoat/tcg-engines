import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const brutusFearsomeCrocodileI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Brutus",
    version: "Fearsome Crocodile",
    text: [
      {
        title: "SPITEFUL",
        description:
          "During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Brutus, das Krokodil",
    version: "Furchterregendes Krokodil",
    text: [
      {
        title: "Bissig",
        description:
          "Wenn dieser Charakter in deinem Zug verbannt wird, falls in diesem Zug einer deiner Charaktere Schaden erhalten hat, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Brutus",
    version: "Redoutable crocodile",
    text: [
      {
        title: "Malveillant",
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
        title: "Malevolo",
        description:
          "Durante il tuo turno, quando questo personaggio viene esiliato, se uno dei tuoi personaggi ha subito danno in questo turno, ottieni 2 leggenda.",
      },
    ],
  },
  es: {
    name: "Bruto",
    version: "Cocodrilo temible",
    text: [
      {
        title: "MALÉVOLO",
        description:
          "Durante tu turno, cuando este personaje sea desterrado, si uno de tus personajes resultó dañado este turno, gana 2 conocimientos.",
      },
    ],
  },
};
