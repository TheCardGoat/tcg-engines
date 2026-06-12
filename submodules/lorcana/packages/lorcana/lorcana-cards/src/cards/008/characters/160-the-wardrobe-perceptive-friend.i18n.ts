import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theWardrobePerceptiveFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Wardrobe",
    version: "Perceptive Friend",
    text: [
      {
        title: "I HAVE JUST THE THING!",
      },
      {
        title: "{E},",
        description: "Choose and discard an item card — Draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Mme. Kommode",
    version: "Aufmerksame Freundin",
    text: [
      {
        title: "DAS HIER PASST BESTIMMT!,",
        description:
          "Wähle eine Gegenstandskarte aus deiner Hand und wirf sie ab — Ziehe 2 Karten.",
      },
    ],
  },
  fr: {
    name: "Madame De Garderobe",
    version: "Amie perspicace",
    text: [
      {
        title: "J'AI CE QU'IL VOUS FAUT!,",
        description: "Défaussez un objet — Piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "L'Armadio",
    version: "Amica Perspicace",
    text: [
      {
        title: "HO PROPRIO LA COSA GIUSTA!,",
        description: "scegli e scarta una carta oggetto — Pesca 2 carte.",
      },
    ],
  },
};
