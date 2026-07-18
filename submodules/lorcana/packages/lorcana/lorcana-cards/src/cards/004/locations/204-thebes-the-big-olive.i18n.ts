import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thebesTheBigOliveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Thebes",
    version: "The Big Olive",
    text: [
      {
        title: "IF YOU CAN MAKE IT HERE...",
        description:
          "During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Theben",
    version: "Theben erleben und sterben",
    text: [
      {
        title: "Wenn du's in Theben schaffst,...",
        description:
          "Jedes Mal, wenn einer deiner Charakter, an diesem Ort, in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Thèbes",
    version: "Le Joyau de la Grèce",
    text: [
      {
        title: "Si tu y arrives maintenant...",
        description:
          "Chaque fois qu'un personnage sur ce lieu en bannit un autre via un défi durant votre tour, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Tebe",
    version: "La Grande Oliva",
    text: [
      {
        title: "Se Ce la Fai Qui...",
        description:
          "Durante il tuo turno, ogni volta che un personaggio esilia un altro personaggio in una sfida mentre si trova in questo luogo, ottieni 2 leggenda.",
      },
    ],
  },
  es: {
    name: "Tebas",
    version: "La gran aceituna",
    text: [
      {
        title: "SI PUEDES HACERLO AQUÍ...",
        description:
          "Durante tu turno, cada vez que un personaje destierre a otro personaje en un desafío mientras estás aquí, gana 2 conocimientos.",
      },
    ],
  },
};
