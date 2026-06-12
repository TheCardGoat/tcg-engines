import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinsCarpetbagI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin's Carpetbag",
    text: [
      {
        title: "HOCKETY POCKETY",
        description: "{E}, 1 {I} — Return an item card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Merlins Reisetasche",
    text: [
      {
        title: "HOCKETI POCKETI, 1",
        description: "— Nimm 1 Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Sac de voyage de Merlin",
    text: [
      {
        title: "HOCKETY POCKETY, 1",
        description: "— Choisissez une carte Objet de votre défausse et placez-la dans votre main.",
      },
    ],
  },
  it: {
    name: "Borsa da Viaggio di Merlino",
    text: [
      {
        title: "HOCKETY POCKETY, 1",
        description: "— Riprendi in mano una carta oggetto dai tuoi scarti.",
      },
    ],
  },
};
