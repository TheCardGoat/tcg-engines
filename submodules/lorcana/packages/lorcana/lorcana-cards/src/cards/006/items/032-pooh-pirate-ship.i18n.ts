import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const poohPirateShipI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pooh Pirate Ship",
    text: [
      {
        title: "MAKE A RESCUE",
        description: "{E}, 3 {I} — Return a Pirate character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Puuh-Piratenschiff",
    text: [
      {
        title: "Wir werden ihn retten",
        description:
          "{E}, 3 {I} — Nimm einen Piraten aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Bateau pirate de Winnie",
    text: [
      {
        title: "Sauvetage en cours",
        description:
          "{E}, 3 {I} — Renvoyez un personnage Pirate de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Nave Pirata di Pooh",
    text: [
      {
        title: "Opereremo un Salvataggio",
        description: "{E}, 3 {I} — Riprendi in mano una carta personaggio Pirata dai tuoi scarti.",
      },
    ],
  },
  es: {
    name: "Barco Pirata Pooh",
    text: [
      {
        title: "HACER UN RESCATE",
        description: "{E}, 3 {I}: devuelve a tu mano una carta de personaje pirata de tu descarte.",
      },
    ],
  },
};
