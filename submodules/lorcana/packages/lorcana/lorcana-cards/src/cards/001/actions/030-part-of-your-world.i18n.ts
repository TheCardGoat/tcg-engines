import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const partOfYourWorldI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Part of Your World",
    text: "Return a character card from your discard to your hand.",
  },
  de: {
    name: "In Deiner Welt",
    text: "Nimm 1 Charakterkarte aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "PARTIR LÀ-BAS",
    text: "Reprenez en main une carte personnage de votre défausse.",
  },
  it: {
    name: "Vivere Là",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Riprendi in mano una carta personaggio dai tuoi scarti.",
  },
};
