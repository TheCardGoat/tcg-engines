import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theBearTerritorialAnimalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Bear",
    version: "Territorial Animal",
    text: [
      {
        title: "Savage Fury",
        description: "While this character has damage, he gets +3 {S}.",
      },
    ],
  },
  de: {
    name: "Der Bär",
    version: "Territoriales Tier",
    text: [
      {
        title: "Wilde Wut",
        description: "Solange dieser Charakter beschädigt ist, erhält er +3 {S}.",
      },
    ],
  },
  fr: {
    name: "L'ours",
    version: "Animal territorial",
    text: [
      {
        title: "Fureur sauvage",
        description: "Tant que ce personnage a au moins un dommage, il gagne +3 {S}.",
      },
    ],
  },
  it: {
    name: "L'Orso",
    version: "Animale Territoriale",
    text: [
      {
        title: "Furia Selvaggia",
        description: "Mentre questo personaggio ha danno, riceve +3 {S}.",
      },
    ],
  },
};
