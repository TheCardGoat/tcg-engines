import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hudsonDeterminedReaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hudson",
    version: "Determined Reader",
    text: [
      {
        title: "FINDING ANSWERS",
        description:
          "When you play this character, you may draw a card, then choose and discard a card.",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Hudson",
    version: "Entschlossener Leser",
    text: [
      {
        title: "ANTWORTEN FINDEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Karte ziehen. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "AM TAGE AUS STEIN",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Hudson",
    version: "Lecteur déterminé",
    text: [
      {
        title: "TROUVER DES RÉPONSES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez piocher une carte puis en défausser une.",
      },
      {
        title: "STATUE LE JOUR",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Hudson",
    version: "Lettore Determinato",
    text: [
      {
        title: "IN CERCA DI RISPOSTE",
        description:
          "Quando giochi questo personaggio, puoi pescare una carta, poi scegli e scarta una carta.",
      },
      {
        title: "STATUE DI GIORNO",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
