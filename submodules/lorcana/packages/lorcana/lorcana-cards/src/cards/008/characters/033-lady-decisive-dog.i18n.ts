import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyDecisiveDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady",
    version: "Decisive Dog",
    text: [
      {
        title: "PACK OF HER OWN",
        description: "Whenever you play a character, this character gets +1 {S} this turn.",
      },
      {
        title: "TAKE THE LEAD",
        description: "While this character has 3 {S} or more, she gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Susi",
    version: "Entschlossene Hundedame",
    text: [
      {
        title: "IHR EIGENES RUDEL",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, erhält dieser Charakter in diesem Zug +1.",
      },
      {
        title: "DIE FÜHRUNG ÜBERNEHMEN",
        description: "Solange dieser Charakter 3 oder mehr hat, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Lady",
    version: "Chienne décidée",
    text: [
      {
        title: "SA MEUTE À ELLE",
        description:
          "Chaque fois que vous jouez un personnage, ce personnage-ci gagne +1 pour le reste de ce tour.",
      },
      {
        title: "PRENDRE L'INITIATIVE",
        description: "Tant que ce personnage a 3 ou plus, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Lilli",
    version: "Cagnolina Risoluta",
    text: [
      {
        title: "UN BRANCO TUTTO SUO",
        description:
          "Ogni volta che giochi un personaggio, questo personaggio riceve +1 per questo turno.",
      },
      {
        title: "PRENDERE IL COMANDO",
        description: "Mentre questo personaggio ha 3 o superiore, riceve +2.",
      },
    ],
  },
};
