import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shenziHyenaPackLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shenzi",
    version: "Hyena Pack Leader",
    text: [
      {
        title: "I'LL HANDLE THIS",
        description: "While this character is at a location, she gets +3 {S}.",
      },
      {
        title: "WHAT'S THE HURRY?",
        description:
          "While this character is at a location, whenever she challenges another character, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Shenzi",
    version: "Hyänen-Rudelführerin",
    text: [
      {
        title: "ICH MACH' DAS SCHON",
        description: "Solange dieser Charakter an einem Ort ist, erhält er +3.",
      },
      {
        title: "SO EILIG?",
        description:
          "Solange dieser Charakter an einem Ort ist, darfst du jedes Mal, wenn er einen anderen Charakter herausfordert, 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Shenzi",
    version: "Cheffe de meute des hyènes",
    text: [
      {
        title: "LAISSE, J'M'EN OCCUPE",
        description: "Tant que ce personnage se trouve sur un lieu, il gagne +3.",
      },
      {
        title: "RIEN NE PRESSE",
        description:
          "Si ce personnage se trouve sur un lieu et défie un autre personnage, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Shenzi",
    version: "Iena Capobranco",
    text: [
      {
        title: "ME NE OCCUPO IO",
        description: "Mentre questo personaggio si trova in un luogo, riceve +3.",
      },
      {
        title: "CHE FRETTA C'È?",
        description:
          "Mentre questo personaggio si trova in un luogo, ogni volta che sfida un altro personaggio, puoi pescare una carta.",
      },
    ],
  },
};
