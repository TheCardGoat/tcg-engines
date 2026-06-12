import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nickWildeSlyFoxI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nick Wilde",
    version: "Sly Fox",
    text: [
      {
        title: "Shift 1",
      },
      {
        title: "CAN'T TOUCH ME",
        description: "While you have an item in play, this character can't be challenged.",
      },
    ],
  },
  de: {
    name: "Nick Wilde",
    version: "Schlitzohr",
    text: [
      {
        title: "Gestaltwandel 1",
      },
      {
        title: "DU KANNST MIR NICHTS ANHABEN",
        description:
          "Solange du mindestens einen Gegenstand im Spiel hast, kann dieser Charakter nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Nick Wilde",
    version: "Renard narquois",
    text: [
      {
        title: "Alter 1",
      },
      {
        title: "TU M'AURAS PAS",
        description: "Tant que vous avez un objet en jeu, ce personnage ne peut pas être défié.",
      },
    ],
  },
  it: {
    name: "Nick Wilde",
    version: "Volpe Acuta",
    text: [
      {
        title: "Trasformazione 1",
      },
      {
        title: "NON PUOI TOCCARMI",
        description: "Mentre hai in gioco un oggetto, questo personaggio non può essere sfidato.",
      },
    ],
  },
};
