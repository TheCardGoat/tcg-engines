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
        title: "Abscheuliches Gebräu",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Gib einem Charakter deiner Wahl in diesem Zug +3 {S}. Wählst du einen Schurken, dann gib dem Charakter stattdessen +4 {S}.",
      },
    ],
  },
  fr: {
    name: "Potion de puissance",
    text: [
      {
        title: "Décoction abjecte",
        description:
          "1 {I}, bannissez cet objet — Choisissez un personnage qui gagne +3 {S} pour le reste de ce tour. Si ce personnage est un Méchant, il gagne +4 {S} à la place.",
      },
    ],
  },
  it: {
    name: "Pozione della Forza",
    text: [
      {
        title: "Intruglio Disgustoso",
        description:
          "1 {I}, esilia questo oggetto — Un personaggio a tua scelta riceve +3 {S} per questo turno. Se quel personaggio è un Cattivo, riceve invece +4 {S}.",
      },
    ],
  },
};
