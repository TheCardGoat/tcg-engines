import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const motherGothelUnderhandedSchemerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mother Gothel",
    version: "Underhanded Schemer",
    text: [
      {
        title: "SOMEBODY'S GOT TO USE IT",
        description: "If a character was banished this turn, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Mutter Gothel",
    version: "Hinterhältige Intrigantin",
    text: [
      {
        title: "Irgendjemand muss ja was davon haben",
        description:
          "Solange in diesem Zug ein Charakter verbannt wurde, erhält dieser Charakter +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Mère Gothel",
    version: "Fourbe conspiratrice",
    text: [
      {
        title: "Quelqu'un doit bien se servir de ça",
        description: "Si un personnage a été banni ce tour-ci, ce personnage-ci gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Madre Gothel",
    version: "Subdola Cospiratrice",
    text: [
      {
        title: "Qualcuno Dovrà Pure Usarlo",
        description:
          "Se un personaggio è stato esiliato in questo turno, questo personaggio riceve +2 {S}.",
      },
    ],
  },
};
