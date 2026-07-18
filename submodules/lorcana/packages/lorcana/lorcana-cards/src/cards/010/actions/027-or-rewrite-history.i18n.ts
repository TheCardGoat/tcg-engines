import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const orRewriteHistoryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Or Rewrite History!",
    text: "Return a character card from your discard to your hand.",
  },
  de: {
    name: "An allen Plätzen",
    text: "Nimm 1 Charakterkarte aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "Nous entrerons dans la bande",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Renvoyez dans votre main une carte Personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "Ma Che Bei Paperi!",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Riprendi in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
  es: {
    name: "¡O reescribir la historia!",
    text: "Devuelve una carta de personaje de tu descarte a tu mano.",
  },
};
