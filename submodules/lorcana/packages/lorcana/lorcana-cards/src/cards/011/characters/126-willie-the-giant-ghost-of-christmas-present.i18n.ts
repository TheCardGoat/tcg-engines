import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const willieTheGiantGhostOfChristmasPresentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Willie the Giant",
    version: "Ghost of Christmas Present",
    text: [
      {
        title: "Boost 3 {I}",
      },
      {
        title: "THE FOOD OF GENEROSITY",
        description:
          "This character can't quest or challenge unless you put a card under him this turn.",
      },
    ],
  },
  de: {
    name: "Willie der Riese",
    version: "Geist der gegenwärtigen Weihnacht",
    text: [
      {
        title: "Stärken 3",
      },
      {
        title: "DIE SPEISE DER GROSSZÜGIGKEIT",
        description:
          "Dieser Charakter kann nicht erkunden oder herausfordern, außer du hast in diesem Zug bereits eine Karte unter ihn gelegt.",
      },
    ],
  },
  fr: {
    name: "Willie le géant",
    version: "Fantôme du Noël présent",
    text: [
      {
        title: "Boost 3",
      },
      {
        title: "UNE AFFAIRE DE GÉNÉROSITÉ",
        description:
          "Ce personnage ne peut ni être envoyé à l'aventure ni défier sauf si vous avez placé une carte sous lui ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Willie il Gigante",
    version: "Fantasma del Natale Presente",
    text: [
      {
        title: "Potenziamento 3",
      },
      {
        title: "IL CIBO DELLA GENEROSITÀ",
        description:
          "Questo personaggio non può andare all'avventura o sfidare a meno che tu non abbia messo una carta sotto di esso in questo turno.",
      },
    ],
  },
};
