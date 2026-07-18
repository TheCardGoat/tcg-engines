import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theWardrobePerceptiveFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Wardrobe",
    version: "Perceptive Friend",
    text: [
      {
        title: "I HAVE JUST THE THING!",
        description: "{E}, Choose and discard an item card — Draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Mme. Kommode",
    version: "Aufmerksame Freundin",
    text: [
      {
        title: "Das hier passt bestimmt!",
        description:
          "{E}, Wähle eine Gegenstandskarte aus deiner Hand und wirf sie ab — Ziehe 2 Karten.",
      },
    ],
  },
  fr: {
    name: "Madame De Garderobe",
    version: "Amie perspicace",
    text: [
      {
        title: "J'ai ce qu'il vous faut!",
        description: "{E}, Défaussez un objet — Piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "L'Armadio",
    version: "Amica Perspicace",
    text: [
      {
        title: "Ho Proprio la Cosa Giusta!",
        description: "{E}, scegli e scarta una carta oggetto — Pesca 2 carte.",
      },
    ],
  },
  es: {
    name: "El armario",
    version: "Amigo perceptivo",
    text: [
      {
        title: "¡TENGO SOLO LA COSA!",
        description: "{E}, elige y descarta una carta de objeto: roba 2 cartas.",
      },
    ],
  },
};
