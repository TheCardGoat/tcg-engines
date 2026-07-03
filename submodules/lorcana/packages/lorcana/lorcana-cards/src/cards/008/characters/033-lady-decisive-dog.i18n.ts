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
        title: "Ihr eigenes Rudel",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, erhält dieser Charakter in diesem Zug +1 {S}.",
      },
      {
        title: "Die Führung übernehmen",
        description: "Solange dieser Charakter 3 oder mehr {S} hat, erhält er +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Lady",
    version: "Chienne décidée",
    text: [
      {
        title: "Sa meute à elle",
        description:
          "Chaque fois que vous jouez un personnage, ce personnage-ci gagne +1 {S} pour le reste de ce tour.",
      },
      {
        title: "Prendre l'initiative",
        description: "Tant que ce personnage a 3 {S} ou plus, il gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Lilli",
    version: "Cagnolina Risoluta",
    text: [
      {
        title: "Un Branco Tutto Suo",
        description:
          "Ogni volta che giochi un personaggio, questo personaggio riceve +1 {S} per questo turno.",
      },
      {
        title: "Prendere il Comando",
        description: "Mentre questo personaggio ha 3 {S} o superiore, riceve +2 {L}.",
      },
    ],
  },
};
