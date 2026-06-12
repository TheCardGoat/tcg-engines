import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const circleOfLifeEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Circle of Life",
    text: [
      {
        title: "Sing Together 8",
      },
      {
        title: "Play a character from your discard for free.",
      },
    ],
  },
  de: {
    name: "Der ewige Kreis",
    text: "Gemeinsam singen 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Spiele eine Charakterkarte kostenlos aus deinem Ablagestapel aus.",
  },
  fr: {
    name: "L'histoire de la vie",
    text: "À l'unisson 8 Jouez gratuitement un personnage de votre défausse.",
  },
  it: {
    name: "Il Cerchio della Vita",
    text: [
      {
        title: "Cantare Insieme 8",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può per cantare questa canzone gratis.) Gioca un personaggio dai tuoi scarti gratis.",
      },
    ],
  },
};
