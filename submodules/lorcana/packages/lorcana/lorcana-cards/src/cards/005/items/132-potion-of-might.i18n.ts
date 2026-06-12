import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const potionOfMightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Potion of Might",
    text: [
      {
        title: "VILE CONCOCTION 1",
        description:
          "{I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
      },
    ],
  },
  de: {
    name: "Trank der Macht",
    text: [
      {
        title: "ABSCHEULICHES",
        description:
          "GEBRÄU 1, Verbanne diesen Gegenstand — Gib einem Charakter deiner Wahl in diesem Zug +3. Wählst du einen Schurken, dann gib dem Charakter stattdessen +4.",
      },
    ],
  },
  fr: {
    name: "Potion de puissance",
    text: [
      {
        title: "DÉCOCTION ABJECTE",
        description:
          "1, bannissez cet objet — Choisissez un personnage qui gagne +3 pour le reste de ce tour. Si ce personnage est un Méchant, il gagne +4 à la place.",
      },
    ],
  },
  it: {
    name: "Pozione della Forza",
    text: [
      {
        title: "INTRUGLIO DISGUSTOSO 1,",
        description:
          "esilia questo oggetto — Un personaggio a tua scelta riceve +3 per questo turno. Se quel personaggio è un Cattivo, riceve invece +4.",
      },
    ],
  },
};
