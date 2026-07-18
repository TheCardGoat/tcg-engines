import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const greatStoneDragonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Great Stone Dragon",
    text: [
      {
        title: "ASLEEP",
        description: "This item enters play exerted.",
      },
      {
        title: "AWAKEN",
        description:
          "{E} — Put a character card from your discard into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Großer Stein-Drache",
    text: [
      {
        title: "Schlafend",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Erwecken",
        description:
          "{E} — Lege 1 Charakterkarte aus deinem Ablagestapel verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Grand Dragon de Pierre",
    text: [
      {
        title: "Endormi",
        description: "Cet objet entre en jeu épuisé.",
      },
      {
        title: "Réveillé",
        description:
          "{E} — Choisissez une carte Personnage de votre défausse et placez-la dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Grande Drago di Pietra",
    text: [
      {
        title: "Dormiente",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "Ridestarsi",
        description:
          "{E} — Aggiungi una carta personaggio dai tuoi scarti al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
  es: {
    name: "Gran Dragón de Piedra",
    text: [
      {
        title: "DORMIDO",
        description: "Este objeto entra en juego ejercido.",
      },
      {
        title: "DESPERTAR",
        description:
          "{E}: coloca una carta de personaje de tu descarte en tu tintero boca abajo y ejercítala.",
      },
    ],
  },
};
