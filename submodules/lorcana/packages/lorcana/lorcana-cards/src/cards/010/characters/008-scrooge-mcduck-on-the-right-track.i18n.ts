import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckOnTheRightTrackI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "On the Right Track",
    text: [
      {
        title: "FABULOUS WEALTH",
        description:
          "When you play this character, chosen character with a card under them gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Auf dem richtigen Weg",
    text: [
      {
        title: "SAGENHAFTER REICHTUM",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen Charakter, der eine Karte unter sich hat. Jener erhält in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Sur la bonne piste",
    text: [
      {
        title: "FABULEUSE FORTUNE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage avec une carte sous lui qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Sulla Strada Giusta",
    text: [
      {
        title: "INCREDIBILE RICCHEZZA",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta con una carta sotto di sé riceve +1 per questo turno.",
      },
    ],
  },
};
