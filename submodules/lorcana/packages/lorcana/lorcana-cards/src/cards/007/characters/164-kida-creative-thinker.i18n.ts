import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kidaCreativeThinkerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kida",
    version: "Creative Thinker",
    text: [
      {
        title: "Ward",
      },
      {
        title: "KEY TO THE PUZZLE",
        description:
          "{E} — Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
      },
    ],
  },
  de: {
    name: "Kida",
    version: "Kreative Denkerin",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "DER",
        description:
          "SCHLÜSSEL ZUM RÄTSEL — Schaue dir die obersten 2 Karten deines Decks an. Lege eine davon verdeckt und erschöpft in deinen Tintenvorrat und die andere zurück auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Kida",
    version: "Penseuse créative",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "CLÉ DE L'ÉNIGME",
        description:
          "— Regardez les 2 premières cartes de votre pioche. Placez-en une dans votre réserve d'encre, face cachée et épuisée, et l'autre sur votre pioche.",
      },
    ],
  },
  it: {
    name: "Kida",
    version: "Pensatrice Creativa",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "CHIAVE DELL'ENIGMA",
        description:
          "— Guarda le prime 2 carte del tuo mazzo. Aggiungine una al tuo calamaio, a faccia in giù e impegnata, e metti l'altra in cima al tuo mazzo.",
      },
    ],
  },
};
