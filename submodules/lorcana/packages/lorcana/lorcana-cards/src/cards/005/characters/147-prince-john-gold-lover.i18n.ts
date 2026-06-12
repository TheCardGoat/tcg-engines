import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeJohnGoldLoverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince John",
    version: "Gold Lover",
    text: [
      {
        title: "BEAUTIFUL, LOVELY TAXES",
        description:
          "{E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
      },
    ],
  },
  de: {
    name: "Prinz John",
    version: "Goldliebhaber",
    text: [
      {
        title: "WUNDERSCHÖNE, LIEBLICHE STEUERN",
        description:
          "— Spiele einen Gegenstand, der 5 oder weniger kostet, von deiner Hand oder aus deinem Ablagestapel kostenlos und erschöpft aus.",
      },
    ],
  },
  fr: {
    name: "Prince Jean",
    version: "Amateur d'or",
    text: [
      {
        title: "MAGNIFIQUES TAXES",
        description:
          "— Jouez gratuitement un objet coûtant 5 ou moins de votre main ou de votre défausse. Il entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Principe Giovanni",
    version: "Amante dell'Oro",
    text: [
      {
        title: "BELLISSIME, ADORABILI TASSE",
        description:
          "— Gioca gratis un oggetto dalla tua mano o dai tuoi scarti con costo 5 o inferiore, impegnato.",
      },
    ],
  },
};
