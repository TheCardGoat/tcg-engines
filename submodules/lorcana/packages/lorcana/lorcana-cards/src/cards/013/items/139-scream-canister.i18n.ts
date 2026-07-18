import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const screamCanisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scream Canister",
    text: [
      {
        title: "Erratic Screams",
        description:
          "{E}, 2 {I} — Exert all cards in your inkwell. Exert chosen opposing character with 2 {S} or less.",
      },
    ],
  },
  de: {
    name: "Schreikanister",
    text: [
      {
        title: "Unkontrollierbare Schreie",
        description:
          "{E}, 2 {I} — Erschöpfe alle Karten in deinem Tintenvorrat. Erschöpfe einen gegnerischen Charakter deiner Wahl mit 2 oder weniger {S}.",
      },
    ],
  },
  fr: {
    name: "Bonbonne de cris",
    text: [
      {
        title: "Cris erratiques",
        description:
          "{E}, 2 {I} — Épuisez toutes les cartes de votre réserve d'encre. Choisissez un personnage adverse ayant 2 {S} ou moins et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Cilindro per le Urla",
    text: [
      {
        title: "Urla Imprevedibili",
        description:
          "{E}, 2 {I} — Impegna tutte le carte nel tuo calamaio. Impegna un personaggio avversario a tua scelta con 2 {S} o inferiore.",
      },
    ],
  },
  es: {
    name: "Bote de grito",
    text: [
      {
        title: "Gritos erráticos",
        description:
          "{E}, 2 {I}: saca todas las cartas de tu tintero. Ejerce el personaje contrario elegido con 2 {S} o menos.",
      },
    ],
  },
};
