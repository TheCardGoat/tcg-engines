import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lostInTheWoodsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lost in the Woods",
    text: "All opposing characters get -2 {S} until the start of your next turn.",
  },
  de: {
    name: "Verlassen im Wald",
    text: "Gib allen gegnerischen Charakteren bis zu Beginn deines nächsten Zuges -2 {S}.",
  },
  fr: {
    name: "J'ai perdu le Nord",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Tous les personnages adverses subissent -2 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Perso Quaggiù",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Tutti i personaggi avversari ricevono -2 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
