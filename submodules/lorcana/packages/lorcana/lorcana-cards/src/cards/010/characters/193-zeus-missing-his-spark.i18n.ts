import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zeusMissingHisSparkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zeus",
    version: "Missing His Spark",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "I NEED MORE THUNDERBOLTS!",
        description: "While there's a card under this character, he gets +2 {S} and +2 {W}.",
      },
    ],
  },
  de: {
    name: "Zeus",
    version: "Vermisst seine Blitze",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "MIR GEHEN DIE BLITZE AUS",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +2 und +2.",
      },
    ],
  },
  fr: {
    name: "Zeus",
    version: "Sans son étincelle",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "DONNEZ-MOI PLUS DE FOUDRE!",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +2 et +2.",
      },
    ],
  },
  it: {
    name: "Zeus",
    version: "Senza la Sua Scintilla",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "MI SERVONO ALTRE SAETTE, FORZA!",
        description: "Mentre c'è una carta sotto a questo personaggio, questo riceve +2 e +2.",
      },
    ],
  },
};
