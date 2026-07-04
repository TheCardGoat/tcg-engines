import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theLeviathanGuardianOfAtlantisI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Leviathan",
    version: "Guardian of Atlantis",
    text: [
      {
        title: "IT'S",
        description:
          "A MACHINE! When you play this character, if 2 or more cards were put into your discard this turn, you may banish any number of chosen opposing characters with total {S} 10 or less.",
      },
    ],
  },
  de: {
    name: "Der Leviathan",
    version: "Wächter von Atlantis",
    text: [
      {
        title: "Es ist eine Maschine!",
        description:
          "Wenn du diesen Charakter ausspielst, falls in diesem Zug mindestens 2 Karten auf deinen Ablagestapel gelegt wurden, darfst du eine beliebige Anzahl an Charakteren deiner Wahl, die zusammen 10 oder weniger {S} haben, verbannen.",
      },
    ],
  },
  fr: {
    name: "Le Léviathan",
    version: "Gardien de l'Atlantide",
    text: [
      {
        title: "C'est une machine!",
        description:
          "Lorsque vous jouez ce personnage, si 2 cartes ou plus ont été placées dans votre défausse ce tour-ci, vous pouvez choisir et bannir autant de personnages adverses que vous le souhaitez, avec une {S} totale de 10 ou moins.",
      },
    ],
  },
  it: {
    name: "Il Leviatano",
    version: "Guardiano di Atlantide",
    text: [
      {
        title: "È una Macchina!",
        description:
          "Quando giochi questo personaggio, se 2 o più carte sono state messe nei tuoi scarti in questo turno, puoi esiliare un qualsiasi numero di personaggi avversari a tua scelta con {S} totale 10 o inferiore.",
      },
    ],
  },
};
