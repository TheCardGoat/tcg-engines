import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iWontGiveInI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I Won't Give In",
    text: "Return a character card with cost 2 or less from your discard to your hand.",
  },
  de: {
    name: "I Won't Give In",
    text: "Nimm eine Charakterkarte mit Kosten von 2 oder weniger aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "I Won't Give In",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Renvoyez une carte Personnage ayant un coût de 2 ou moins de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "I Won't Give In",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Riprendi in mano una carta personaggio con costo 2 o inferiore dai tuoi scarti.",
      },
    ],
  },
  es: {
    name: "No me rendiré",
    text: "Devuelve a tu mano una carta de personaje con coste 2 o menos de tu descarte.",
  },
};
