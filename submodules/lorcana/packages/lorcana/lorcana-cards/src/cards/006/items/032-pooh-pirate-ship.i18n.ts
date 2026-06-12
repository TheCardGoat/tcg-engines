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
        title: "WIR WERDEN IHN RETTEN, 3",
        description: "— Nimm einen Piraten aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Bateau pirate de Winnie",
    text: [
      {
        title: "SAUVETAGE EN COURS, 3",
        description: "— Renvoyez un personnage Pirate de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Nave Pirata di Pooh",
    text: [
      {
        title: "OPEREREMO UN SALVATAGGIO, 3",
        description: "— Riprendi in mano una carta personaggio Pirata dai tuoi scarti.",
      },
    ],
  },
};
