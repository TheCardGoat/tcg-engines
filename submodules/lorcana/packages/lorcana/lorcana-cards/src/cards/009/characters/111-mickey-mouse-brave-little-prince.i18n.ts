import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseBraveLittlePrinceI18n: Record<Languages, I18nProperties> = {
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
        title: "<Gestaltwandel> 5 {I}",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Krönender Abschluss",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +3 {S}, +3 {W} und +3 {L}.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Brave petit prince",
    text: [
      {
        title: "<Alter> 5 {I}",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Couronné de gloire",
        description:
          "Tant que ce personnage a une carte sous lui, il gagne +3 {S}, +3 {W} et +3 {L}.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Eroico Principe",
    text: [
      {
        title: "<Trasformazione> 5 {I}",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Impresa Coronata",
        description:
          "Mentre questo personaggio ha una carta sotto di sé, riceve +3 {S}, +3 {W} e +3 {L}.",
      },
    ],
  },
};
