import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theLibraryAGiftForBelleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Library",
    version: "A Gift for Belle",
    text: [
      {
        title: "LOST IN A BOOK",
        description: "Whenever a character is banished while here, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Die Bibliothek",
    version: "Ein Geschenk für Belle",
    text: [
      {
        title: "IN EINEM BUCH VERSUNKEN",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "La Bibliothèque",
    version: "Un cadeau pour Belle",
    text: [
      {
        title: "UNE ÉTERNITÉ DE LECTURE",
        description: "Lorsqu'un personnage sur ce lieu est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "La Biblioteca",
    version: "Un Dono per Belle",
    text: [
      {
        title: "PERSA IN UN LIBRO",
        description:
          "Ogni volta che un personaggio viene esiliato mentre si trova in questo luogo, puoi pescare una carta.",
      },
    ],
  },
};
