import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hadesLordOfTheUnderworldI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hades",
    version: "Lord of the Underworld",
    text: [
      {
        title: "WELL OF SOULS",
        description:
          "When you play this character, return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Hades",
    version: "Herrscher der Unterwelt",
    text: [
      {
        title: "FLUSS DES TODES",
        description:
          "Wenn du diesen Charakter ausspielst, nimm 1 Charakterkarte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "HADÈS",
    version: "Seigneur des Enfers",
    text: [
      {
        title: "PUITS DES ÂMES",
        description:
          "Lorsque vous jouez ce personnage, reprenez en main une carte personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "Ade",
    version: "Signore dell'Oltretomba",
    text: [
      {
        title: "POZZO DELLE ANIME",
        description:
          "Quando giochi questo personaggio, riprendi in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
