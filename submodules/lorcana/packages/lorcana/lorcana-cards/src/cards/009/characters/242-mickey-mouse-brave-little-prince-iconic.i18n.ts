import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseBraveLittlePrinceIconicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Brave Little Prince",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "Evasive",
      },
      {
        title: "CROWNING ACHIEVEMENT",
        description:
          "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Tapferer Kleiner Prinz",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "Wendig",
      },
      {
        title: "KRÖNENDER ABSCHLUSS",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +3, +3 und +3.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Brave petit prince",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "COURONNÉ DE GLOIRE",
        description: "Tant que ce personnage a une carte sous lui, il gagne +3, +3 et +3.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Eroico Principe",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "IMPRESA CORONATA",
        description: "Mentre questo personaggio ha una carta sotto di sé, riceve +3, +3 e +3.",
      },
    ],
  },
};
