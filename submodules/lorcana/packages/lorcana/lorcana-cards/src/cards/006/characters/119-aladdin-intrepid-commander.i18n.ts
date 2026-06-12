import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinIntrepidCommanderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Intrepid Commander",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "REMEMBER YOUR TRAINING",
        description: "When you play this character, your characters get +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Unerschrockener Kommandant",
    text: [
      {
        title: "Gestaltwandel 2",
      },
      {
        title: "ERINNERE DICH AN DEIN TRAINING",
        description:
          "Wenn du diesen Charakter ausspielst, erhalten deine Charaktere in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "Commandant intrépide",
    text: [
      {
        title: "Alter 2",
      },
      {
        title: "RAPPELLE-TOI TON ENTRAÎNEMENT",
        description:
          "Lorsque vous jouez ce personnage, vos personnages gagnent +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Comandante Intrepido",
    text: [
      {
        title: "Trasformazione 2",
      },
      {
        title: "RICORDA IL TUO ADDESTRAMENTO",
        description:
          "Quando giochi questo personaggio, i tuoi personaggi ricevono +2 per questo turno.",
      },
    ],
  },
};
