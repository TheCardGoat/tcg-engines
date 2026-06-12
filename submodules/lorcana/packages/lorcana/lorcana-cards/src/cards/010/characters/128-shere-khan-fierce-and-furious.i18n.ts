import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shereKhanFierceAndFuriousI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shere Khan",
    version: "Fierce and Furious",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "WILD RAGE 1",
        description:
          "{I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Shir Khan",
    version: "Wild und Wütend",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "WILDER ZORN 1,",
        description:
          "Füge diesem Charakter 1 Schaden zu — Mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Shere Khan",
    version: "Furieusement féroce",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "RAGE SAUVAGE 1,",
        description:
          "Infligez 1 dommage à ce personnage — Redressez ce personnage. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Shere Khan",
    version: "Feroce e Furioso",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "COLLERA SELVAGGIA 1,",
        description:
          "infliggi 1 danno a questo personaggio — Prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
