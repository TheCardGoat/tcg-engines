import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const timeToGoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Time to Go!",
    text: "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.",
  },
  de: {
    name: "Zeit, zu gehen!",
    text: "Wähle und verbanne einen deiner Charaktere, um 2 Karten zu ziehen. Falls der Charakter mindestens eine Karte unter sich hatte, ziehe stattdessen 3 Karten.",
  },
  fr: {
    name: "Il est temps de partir !",
    text: "Choisissez l'un de vos personnages et bannissez-le pour piocher 2 cartes. S'il y avait une carte sous lui, piochez 3 cartes à la place.",
  },
  it: {
    name: "È ora di Andare!",
    text: "Esilia un tuo personaggio a tua scelta per pescare 2 carte. Se quel personaggio aveva una carta sotto di sé, pesca invece 3 carte.",
  },
};
